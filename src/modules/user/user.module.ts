import { Module } from '@nestjs/common';
import { PaginationService } from '../pagination/pagination.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
	controllers: [UserController],
	providers: [UserService, PrismaService, PaginationService],
	exports: [UserService]
})
export class UserModule {}
