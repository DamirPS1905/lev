import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

@Module({
  imports: [MikroOrmModule.forRoot(), MikroOrmModule.forFeature({})],
  exports: [MikroOrmModule],
})
export class OrmModule {}
