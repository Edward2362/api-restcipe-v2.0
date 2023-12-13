import { Module } from '@nestjs/common';
import { imports, controllers, providers } from "./app.config";

@Module({
  imports: imports,
  controllers: controllers,
  providers: providers,
})
export class AppModule {}
