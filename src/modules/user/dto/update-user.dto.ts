import { ApiProperty } from '@nestjs/swagger';
import { EnumUserRole } from '@prisma/client';
import {
	IsEmail,
	IsEnum,
	IsOptional,
	IsString,
	MinLength
} from 'class-validator';
import { PaginationDto } from '../../pagination/dto/pagination.dto';

export class UpdateUserDto {
	@ApiProperty()
	@IsEmail()
	email: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	@MinLength(3, { message: 'Username должен содержать минимум 3 символа' })
	username: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	avatarPath: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	@MinLength(8, { message: 'Password должен содержать минимум 8 символов' })
	password: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsEnum(EnumUserRole)
	role: EnumUserRole;
}

export enum EnumSort {
	NEWEST = 'newest',
	OLDEST = 'oldest'
}

export class FilterUserDto extends PaginationDto {
	@IsOptional()
	@IsEnum(EnumSort)
	sort: EnumSort;

	@IsOptional()
	@IsString()
	searchTerm: string;
}
