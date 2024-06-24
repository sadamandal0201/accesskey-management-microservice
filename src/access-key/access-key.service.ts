import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class AccessKeyService {
  private redisClient: RedisClientType;
  private pubClient: RedisClientType;

  constructor(private configService: ConfigService) {
    this.redisClient = createClient({
      url: this.configService.get<string>(process.env.REDIS_URL),
    });
    this.pubClient = createClient({
      url: this.configService.get<string>(process.env.REDIS_URL),
    });
  }

  async onModuleInit() {
    await this.redisClient.connect();
    await this.pubClient.connect();
  }

  async generateKey(
    userId: string,
    rateLimit: number,
    expiration: number,
  ): Promise<string> {
    const key = `${userId}-${Date.now()}`;
    await this.redisClient.hSet(key, {
      rateLimit: rateLimit.toString(),
      expiration: expiration.toString(),
      requests: '0',
    });
    await this.pubClient.publish(
      'key-events',
      JSON.stringify({ event: 'key-created', key }),
    );
    return key;
  }

  async getKeyDetails(key: string): Promise<any> {
    const keyDetails = await this.redisClient.hGetAll(key);

    if (Object.keys(keyDetails).length === 0) {
      throw new NotFoundException('Key not found or invalid');
    }
    return keyDetails;
  }

  async deleteKey(key: string): Promise<string> {
    const deletedCount = await this.redisClient.del(key);
    if (deletedCount === 0) {
      throw new NotFoundException('Key not found or invalid');
    }
    return 'Access key deleted successfully';
  }

  async updateKey(
    key: string,
    rateLimit: number,
    expiration: number,
  ): Promise<string> {
    const keyExists = await this.redisClient.exists(key);
    if (keyExists === 0) {
      throw new NotFoundException('Key not found or invalid');
    }
    await this.redisClient.hSet(key, {
      rateLimit: rateLimit.toString(),
      expiration: expiration.toString(),
    });
    return 'Access key Updated successfully';
  }
}
