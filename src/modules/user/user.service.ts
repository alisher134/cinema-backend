import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { hash } from 'argon2';
import { AuthDto } from '../auth/dto/auth.dto';
import { PaginationService } from '../pagination/pagination.service';
import { PrismaService } from '../prisma/prisma.service';
import { EnumSort, FilterUserDto, UpdateUserDto } from './dto/update-user.dto';
import { IUser, IUserResponse } from './user.interface';
import { UserSelect } from './user.select';

@Injectable()
export class UserService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly paginationService: PaginationService
	) {}

	async findByEmail(email: string): Promise<User> {
		return await this.prismaService.user.findUnique({
			where: { email }
		});
	}

	async findByUsername(username: string): Promise<IUser> {
		return await this.prismaService.user.findUnique({
			where: { username }
		});
	}

	//* Admin endpoints

	async getAll(dto: FilterUserDto): Promise<IUserResponse> {
		const { perPage, skip } = this.paginationService.getPagination(dto);

		const searchTermQuery = dto.searchTerm
			? this.getSearchTermFilter(dto.searchTerm)
			: {};

		const users = await this.prismaService.user.findMany({
			where: searchTermQuery,
			orderBy: this.getSortOptions(dto.sort),
			select: UserSelect,
			take: perPage,
			skip
		});

		const totalCount = await this.prismaService.user.count({
			where: searchTermQuery
		});

		return { users, totalCount };
	}

	async findById(id: string): Promise<User> {
		const user = await this.prismaService.user.findUnique({
			where: { id },
			select: UserSelect
		});

		if (!user) throw new NotFoundException('Пользователь не найден!');

		return user;
	}

	async update(dto: UpdateUserDto, id: string): Promise<IUser> {
		await this.validateUniqueFields(dto, id);

		const user = await this.findById(id);

		const userData: Prisma.UserUpdateInput = {
			...dto,
			password: dto.password
				? await this.hashPassword(dto.password)
				: user.password
		};

		return await this.prismaService.user.update({
			where: { id },
			data: userData,
			select: UserSelect
		});
	}

	async delete(id: string): Promise<{ message: string }> {
		await this.findById(id);

		await this.prismaService.user.delete({
			where: { id }
		});

		return {
			message: `Пользователь с id - ${id} был удален`
		};
	}

	async create(dto: AuthDto): Promise<User> {
		const userData: Prisma.UserCreateInput = {
			...dto,
			password: await this.hashPassword(dto.password)
		};

		return await this.prismaService.user.create({
			data: userData
		});
	}

	private getSearchTermFilter(searchTerm: string): Prisma.UserWhereInput {
		return {
			OR: [
				{
					email: {
						contains: searchTerm,
						mode: 'insensitive'
					}
				},
				{
					username: {
						contains: searchTerm,
						mode: 'insensitive'
					}
				}
			]
		};
	}

	private getSortOptions(sort: EnumSort): Prisma.UserOrderByWithRelationInput {
		return sort === EnumSort.OLDEST
			? { createdAt: 'asc' }
			: { createdAt: 'desc' };
	}

	private async validateUniqueFields(dto: UpdateUserDto, id: string) {
		const existingEmail = await this.findByEmail(dto.email);
		if (existingEmail && existingEmail.id !== id)
			throw new BadRequestException('Email уже используется!');

		if (dto.username) {
			const existingUsernameUser = await this.findByUsername(dto.username);

			if (existingUsernameUser && existingUsernameUser.id !== id)
				throw new BadRequestException('Username уже используется!');
		}
	}

	private async hashPassword(password: string): Promise<string> {
		return await hash(password);
	}
}
