import { JwtStrategy } from '@/src/strategies/jwt.strategy';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PaginationService } from '../pagination/pagination.service';
import { PrismaService } from '../prisma/prisma.service';
import { TokenModule } from '../token/token.module';
import { TokenService } from '../token/token.service';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokenService } from './refresh-token.service';

@Module({
	imports: [TokenModule, JwtModule],
	controllers: [AuthController],
	providers: [
		AuthService,
		UserService,
		PrismaService,
		RefreshTokenService,
		TokenService,
		JwtStrategy,
		PaginationService
	]
})
export class AuthModule {}
