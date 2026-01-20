import { NestFactory } from '@nestjs/core';
import { NestBasicsModule } from './nest-basics.module';

async function bootstrap() {
  const app = await NestFactory.create(NestBasicsModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
