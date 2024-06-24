import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AccessKeyController } from './access-key.controller';
import { AccessKeyService } from './access-key.service';

@Module({
  imports: [ConfigModule],
  controllers: [AccessKeyController],
  providers: [AccessKeyService],
})
export class AccessKeyModule {}
