import { User } from '@prisma/client';

export interface IUser extends Omit<User, 'password'> {}

export interface IUserResponse {
	users: IUser[];
	totalCount: number;
}
