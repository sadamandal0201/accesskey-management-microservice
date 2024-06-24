import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Patch,
} from '@nestjs/common';
import { AccessKeyService } from './access-key.service';

@Controller('access-key')
export class AccessKeyController {
  constructor(private readonly accessKeyService: AccessKeyService) {}

  @Post()
  async generateKey(@Body() body: any) {
    const { userId, rateLimit, expiration } = body;
    return this.accessKeyService.generateKey(userId, rateLimit, expiration);
  }

  @Get(':key')
  async getKeyDetails(@Param('key') key: string) {
    return this.accessKeyService.getKeyDetails(key);
  }

  @Delete(':key')
  async deleteKey(@Param('key') key: string) {
    return this.accessKeyService.deleteKey(key);
  }

  @Patch(':key')
  async updateKey(@Param('key') key: string, @Body() body: any) {
    const { rateLimit, expiration } = body;
    return this.accessKeyService.updateKey(key, rateLimit, expiration);
  }
}
