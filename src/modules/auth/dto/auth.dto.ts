import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class AuthDto {
	@ApiProperty({
		example: 'user@example.com',
		description: 'Электронная почта'
	})
	@IsEmail()
	email: string;

	@ApiProperty({
		example: 'password123',
		description: 'Пароль (минимум 8 символов)'
	})
	@IsString()
	@MinLength(8, { message: 'Password должен содержать минимум 8 символов' })
	password: string;

	@ApiProperty({
		example: 'user123',
		description: 'Имя пользователя (опционально, для логина не надо)',
		required: false
	})
	@IsOptional()
	@IsString()
	@MinLength(3, { message: 'Username должен содержать минимум 3 символа' })
	username: string;
}
