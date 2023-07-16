import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';


dotenv.config();
const port = process.env.PORT || 3000;
async function bootstrap() {
  console.log("Service up and running")
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
}
bootstrap();
