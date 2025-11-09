import { ConfigService } from '@nestjs/config';
import { IsString, MaxLength, MinLength } from 'class-validator';
import {
  bioMaxLength,
  imageMaxLength,
  passwordMaxLength,
  passwordMinLength,
  usernameMaxLength,
  usernameMinLength,
} from 'src/common/constants/user.constant';
import {
  EmailRequired,
  LengthDistance,
  StringRequired,
} from 'src/common/decorators';

export class CreateUserDto {
  @StringRequired('Name')
  @MaxLength(20, { message: 'Name must be at most 20 characters long' })
  name: string;

  @StringRequired('Username')
  @LengthDistance(usernameMinLength, usernameMaxLength, 'Username')
  username: string;

  @EmailRequired('Email')
  email: string;

  @StringRequired('Password')
  @LengthDistance(passwordMinLength, passwordMaxLength, 'Password')
  password: string;

  @IsString({ message: 'Bio must be a string' })
  @MaxLength(bioMaxLength, {
    message: `Bio must be at most ${bioMaxLength} characters long`,
  })
  bio?: string;

  @IsString({ message: 'Image must be a string' })
  @MaxLength(imageMaxLength, {
    message: `Image must be at most ${imageMaxLength} characters long`,
  })
  image?: string;
}
