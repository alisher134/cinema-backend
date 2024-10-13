import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);
	app.setGlobalPrefix('api/v1');
	app.use(cookieParser());

	const config = new DocumentBuilder()
		.setTitle('Cinema API')
		.setDescription(
			'API for viewing movies in an online cinema platform, allowing users to browse, search, and filter movies.'
		)
		.setVersion('1.0')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	app.enableCors({
		origin: [configService.get<string>('ALLOWED_ORIGIN')],
		exposedHeaders: ['set-cookie'],
		credentials: true
	});

	await app.listen(configService.get<number>('PORT'));
}
bootstrap();
