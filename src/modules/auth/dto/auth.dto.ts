import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class AuthDto {
	@ApiProperty()
	@IsEmail()
	email: string;

	@ApiProperty()
	@IsString()
	@MinLength(8, { message: 'Password должен содержать минимум 8 символов' })
	password: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	@MinLength(3, { message: 'Username должен содержать минимум 3 символа' })
	username: string;
}
