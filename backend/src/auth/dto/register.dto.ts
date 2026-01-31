import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @MaxLength(254)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^(?![0-9])[A-Za-z0-9_]+$/, {
    message:
      'username can only contain letters, numbers, and underscores, and cannot start with a number',
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  @Matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,}$/, {
    message:
      'password must be at least 6 characters, with 1 number, 1 lowercase, and 1 uppercase',
  })
  password: string;
}
