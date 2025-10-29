import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Tên không được để trống' })
  @IsString({ message: 'Tên phải là một chuỗi' })
  name: string;

  @IsString({ message: 'Username phải là một chuỗi' })
  @IsNotEmpty({ message: 'Username không được để trống' })
  username: string;

  @IsString({ message: 'Email phải là một chuỗi' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsString({ message: 'Password phải là một chuỗi' })
  @IsNotEmpty({ message: 'Password không được để trống' })
  password: string;

  @IsString({ message: 'Bio phải là một chuỗi' })
  @IsOptional()
  bio?: string;

  @IsString({ message: 'Image phải là một chuỗi' })
  @IsOptional()
  image?: string;
}
