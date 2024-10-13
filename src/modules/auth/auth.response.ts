import { User } from '@prisma/client';

export interface IAuthResponse extends ITokens {
	user: Omit<User, 'password'>;
}

export interface ITokens {
	accessToken: string;
	refreshToken: string;
}
