import { Auth } from '@/src/decorators/auth.decorator';
import { CurrentUser } from '@/src/decorators/user.decorator';
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EnumUserRole } from '@prisma/client';
import { FilterUserDto, UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('USER')
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiOperation({ summary: 'Получения профиля' })
	@ApiResponse({ status: 200, type: UpdateUserDto })
	@Auth()
	@Get('profile')
	getProfile(@CurrentUser('id') id: string) {
		return this.userService.findById(id);
	}

	@ApiOperation({ summary: 'Обновление профиля' })
	@ApiResponse({ status: 200, type: UpdateUserDto })
	@Auth()
	@UsePipes(new ValidationPipe())
	@Put('profile')
	@HttpCode(HttpStatus.OK)
	updateProfile(@Body() dto: UpdateUserDto, @CurrentUser('id') id: string) {
		return this.userService.update(dto, id);
	}

	//* Admin endpoints

	@ApiOperation({ summary: 'Получение всех пользователей' })
	@ApiResponse({ status: 200, type: [UpdateUserDto] })
	@Auth(EnumUserRole.ADMIN)
	@Get()
	getAll(@Query() dto: FilterUserDto) {
		return this.userService.getAll(dto);
	}

	@ApiOperation({ summary: 'Получения пользователя по id' })
	@ApiResponse({ status: 200, type: UpdateUserDto })
	@Auth(EnumUserRole.ADMIN)
	@Get(':id')
	getUser(@Param('id') id: string) {
		return this.userService.findById(id);
	}

	@ApiOperation({ summary: 'Обновление пользователя' })
	@ApiResponse({ status: 200, type: UpdateUserDto })
	@Auth()
	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(HttpStatus.OK)
	updateUser(@Body() dto: UpdateUserDto, @Param('id') id: string) {
		return this.userService.update(dto, id);
	}

	@ApiOperation({ summary: 'Удаление пользователя' })
	@ApiResponse({ status: 200 })
	@Auth(EnumUserRole.ADMIN)
	@Delete(':id')
	deleteUser(@Param('id') id: string) {
		return this.userService.delete(id);
	}
}
