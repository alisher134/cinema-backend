import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EnumUserRole } from '@prisma/client';
import { ITokens } from '../auth/auth.response';

@Injectable()
export class TokenService {
	private EXPIRATION_ACCESS_TOKEN = '1h';
	private EXPIRATION_REFRESH_TOKEN = '1d';

	constructor(private readonly jwtService: JwtService) {}

	async generateToken(userId: string, role: EnumUserRole): Promise<ITokens> {
		const payload = { id: userId, role };

		const accessToken = await this.jwtService.signAsync(payload, {
			expiresIn: this.EXPIRATION_ACCESS_TOKEN
		});

		const refreshToken = await this.jwtService.signAsync(payload, {
			expiresIn: this.EXPIRATION_REFRESH_TOKEN
		});

		return { accessToken, refreshToken };
	}

	async verifyToken(refreshToken: string) {
		return await this.jwtService.verifyAsync(refreshToken);
	}
}
