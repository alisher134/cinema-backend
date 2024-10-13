import {
	Body,
	Controller,
	Post,
	Req,
	Res,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenService } from './refresh-token.service';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly refreshTokenService: RefreshTokenService
	) {}

	@ApiOperation({ summary: 'Аутентификация пользователя' })
	@ApiResponse({ status: 201 })
	@UsePipes(new ValidationPipe())
	@Post('login')
	async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
		const { refreshToken, ...response } = await this.authService.login(dto);

		this.refreshTokenService.addRefreshTokenToResponse(res, refreshToken);

		return response;
	}

	@ApiOperation({ summary: 'Регистрация пользователя' })
	@ApiResponse({ status: 201 })
	@UsePipes(new ValidationPipe())
	@Post('register')
	async register(
		@Body() dto: AuthDto,
		@Res({ passthrough: true }) res: Response
	) {
		const { refreshToken, ...response } = await this.authService.register(dto);

		this.refreshTokenService.addRefreshTokenToResponse(res, refreshToken);

		return response;
	}

	@ApiOperation({ summary: 'Получение новых токенов' })
	@ApiResponse({ status: 201 })
	@UsePipes(new ValidationPipe())
	@Post('new-tokens')
	async getNewTokens(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response
	) {
		const refreshTokenFromCookies =
			req.cookies[this.refreshTokenService.REFRESH_TOKEN_NAME];

		const { refreshToken, ...response } = await this.authService.getNewTokens(
			refreshTokenFromCookies
		);

		this.refreshTokenService.addRefreshTokenToResponse(res, refreshToken);

		return response;
	}

	@ApiOperation({ summary: 'Выход' })
	@ApiResponse({ status: 201 })
	@UsePipes(new ValidationPipe())
	@Post('logout')
	async logout(@Res({ passthrough: true }) res: Response) {
		this.refreshTokenService.removeRefreshTokenFromResponse(res);
	}
}
