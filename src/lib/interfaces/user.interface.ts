import { Roles } from '../enums/roles.enum';

export interface IAuth {
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly role: Roles;
}
