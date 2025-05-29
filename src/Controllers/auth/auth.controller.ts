import {
  Body,
  Controller,
  Post,
  Res,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/Filters/HTTPExceptions';
import { LoginDTO } from 'src/lib/dtos/login.dto';
import { RefreshTokenDTO } from 'src/lib/dtos/refresh-token.dto';
import { UserDTO } from 'src/lib/dtos/user.dto';
import { SignupPipe } from 'src/Pipes/signup.pipe';
import { AuthService } from 'src/Services/auth/auth.service';

@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseFilters(HttpExceptionFilter)
  @UsePipes(SignupPipe)
  async register(@Res({ passthrough: true }) response, @Body() user: UserDTO) {
    const registerToken = await this.authService.register(user);
    response.cookie('access_token', registerToken.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return response
      .status(201)
      .json({ accessToken: registerToken.accessToken });
  }

  @Post('login')
  @UseFilters(HttpExceptionFilter)
  async login(@Res({ passthrough: true }) response, @Body() user: LoginDTO) {
    const loginToken = await this.authService.login(user);
    // set cookies for access and refresh tokens
    response.cookie('access_token', loginToken.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    response.cookie('refresh_token', loginToken.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return response.status(200).json({
      accessToken: loginToken.accessToken,
      refreshToken: loginToken.refreshToken,
    });
  }

  @Post('refresh')
  async refreshToken(@Res() response, @Body() refreshToken: RefreshTokenDTO) {
    const newToken = await this.authService.refreshToken(refreshToken.token);
    return response.status(200).json({ accessToken: newToken });
  }
}
