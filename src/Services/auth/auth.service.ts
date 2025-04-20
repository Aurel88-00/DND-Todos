import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { IAuth } from 'src/lib/interfaces/user.interface';
import * as argon2 from 'argon2';
import { UserDTO } from 'src/lib/dtos/user.dto';
import { LoginDTO } from 'src/lib/dtos/login.dto';
import { IRefreshToken } from 'src/lib/interfaces/refresh-token.interface';
import { generateString } from 'src/utils/generateString';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<IAuth>,
    @InjectModel('RefreshToken')
    private refreshTokenModel: Model<IRefreshToken>,
    private readonly jwtService: JwtService,
  ) {}

  async register(user: UserDTO): Promise<{ accessToken: string }> {
    const { email, password, role, username } = user;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await argon2.hash(password);
    const newUser = new this.userModel({
      email,
      username,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    const payload = { sub: newUser._id, email, role };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }

  async login(
    user: LoginDTO,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = user;
    const existingUser = await this.userModel.findOne({ email });
    if (!existingUser) {
      throw new ConflictException(`User with email ${email} not found!`);
    }

    const isValid = await argon2.verify(existingUser.password, password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    const payload = {
      sub: existingUser._id,
      email,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = generateString(16);
    await this.storeRefreshToken(refreshToken, existingUser._id);

    return { accessToken, refreshToken };
  }

  async storeRefreshToken(token: string, userId: mongoose.Types.ObjectId) {
    await this.refreshTokenModel.create({
      token,
      userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });
  }

  async refreshToken(refreshToken: string) {
    const refreshTokenDoc = await this.refreshTokenModel.findOne({
      token: refreshToken,
      expiresAt: { $gt: Date.now() },
    });
    if (!refreshTokenDoc) {
      throw new UnauthorizedException('Invalid or revoked refresh token');
    }

    return generateString(16);
  }
}
