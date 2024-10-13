import {
	BadRequestException,
	Injectable,
	UnauthorizedException
} from '@nestjs/common';
import { User } from '@prisma/client';
import { verify } from 'argon2';
import { TokenService } from '../token/token.service';
import { UserService } from '../user/user.service';
import { IAuthResponse } from './auth.response';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly tokenService: TokenService
	) {}

	async login(dto: AuthDto): Promise<IAuthResponse> {
		const user = await this.validateUser(dto);

		return await this.buildResponse(user);
	}

	async register(dto: AuthDto): Promise<IAuthResponse> {
		await this.checkExists(dto.email, dto.username);
		const user = await this.userService.create(dto);

		return await this.buildResponse(user);
	}

	async getNewTokens(refreshToken: string): Promise<IAuthResponse> {
		if (!refreshToken)
			throw new UnauthorizedException(
				'К сожалению, мы не обнаружили ваш refresh токен. Пожалуйста, войдите в систему для получения нового токена'
			);

		const result = await this.tokenService.verifyToken(refreshToken);

		const user = await this.userService.findById(result.id);

		return this.buildResponse(user);
	}

	private async checkExists(email: string, username: string) {
		const isExistsEmail = await this.userService.findByEmail(email);
		if (isExistsEmail) throw new BadRequestException('Email занят');

		const isExistsUsername = await this.userService.findByUsername(username);
		if (isExistsUsername) throw new BadRequestException('Username занят');
	}

	private async validateUser(dto: AuthDto): Promise<User> {
		const user = await this.userService.findByEmail(dto.email);
		if (!user) throw new BadRequestException('Неверный email или password');

		const isValidPassword = await verify(user.password, dto.password);
		if (!isValidPassword)
			throw new BadRequestException('Неверный email или password');

		return user;
	}

	private omitPassword(user: User): Omit<User, 'password'> {
		const { password, ...rest } = user;

		return rest;
	}

	private async buildResponse(user: User): Promise<IAuthResponse> {
		const tokens = await this.tokenService.generateToken(user.id, user.role);

		return {
			user: this.omitPassword(user),
			...tokens
		};
	}
}
