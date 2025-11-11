import { StringRequired } from 'src/common/decorators';

export class SignInDto {
  @StringRequired('Email')
  email: string;

  @StringRequired('Password')
  password: string;
}
