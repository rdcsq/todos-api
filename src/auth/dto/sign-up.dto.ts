import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email!: string;

  @IsString()
  name!: string;

  @IsStrongPassword()
  password!: string;
}
