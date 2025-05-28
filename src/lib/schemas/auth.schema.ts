import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Roles } from '../enums/roles.enum';

@Schema()
export class Auth {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  role: Roles;

}

export const AuthSchema = SchemaFactory.createForClass(Auth);
