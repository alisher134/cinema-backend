import { Prisma } from '@prisma/client';

export const UserSelect: Prisma.UserSelect = {
	id: true,
	createdAt: true,
	updatedAt: true,
	email: true,
	username: true,
	role: true,
	avatarPath: true,
	password: false
};
