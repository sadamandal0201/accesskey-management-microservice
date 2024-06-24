import { Test, TestingModule } from '@nestjs/testing';
import { AccessKeyController } from './access-key.controller';
import { AccessKeyService } from './access-key.service';

describe('AccessKeyController', () => {
  let controller: AccessKeyController;
  let accessKeyService: AccessKeyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccessKeyController],
      providers: [
        {
          provide: AccessKeyService,
          useValue: {
            generateKey: jest.fn(),
            getKeyDetails: jest.fn(),
            deleteKey: jest.fn(),
            updateKey: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AccessKeyController>(AccessKeyController);
    accessKeyService = module.get<AccessKeyService>(AccessKeyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('generateKey', () => {
    it('should generate a new access key', async () => {
      const userId = 'user1';
      const rateLimit = 100;
      const expiration = 3600;
      const generatedKey = 'user1-1234567890'; // Mock generated key

      jest
        .spyOn(accessKeyService, 'generateKey')
        .mockResolvedValue(generatedKey);

      const result = await controller.generateKey({
        userId,
        rateLimit,
        expiration,
      });
      expect(result).toEqual(generatedKey);
      expect(accessKeyService.generateKey).toHaveBeenCalledWith(
        userId,
        rateLimit,
        expiration,
      );
    });
  });

  describe('getKeyDetails', () => {
    it('should return key details', async () => {
      const key = 'test-key';
      const keyDetails = {
        rateLimit: '100',
        expiration: '3600',
        requests: '0',
      };

      jest
        .spyOn(accessKeyService, 'getKeyDetails')
        .mockResolvedValue(keyDetails);

      const result = await controller.getKeyDetails(key);
      expect(result).toEqual(keyDetails);
      expect(accessKeyService.getKeyDetails).toHaveBeenCalledWith(key);
    });
  });

  describe('deleteKey', () => {
    it('should delete the key', async () => {
      const key = 'test-key';

      jest.spyOn(accessKeyService, 'deleteKey').mockResolvedValue(undefined);

      const result = await controller.deleteKey(key);
      expect(result).toBeUndefined();
      expect(accessKeyService.deleteKey).toHaveBeenCalledWith(key);
    });
  });

  describe('updateKey', () => {
    it('should update key details', async () => {
      const key = 'test-key';
      const rateLimit = 200;
      const expiration = 7200;

      jest.spyOn(accessKeyService, 'updateKey').mockResolvedValue(undefined);

      const result = await controller.updateKey(key, { rateLimit, expiration });
      expect(result).toBeUndefined();
      expect(accessKeyService.updateKey).toHaveBeenCalledWith(
        key,
        rateLimit,
        expiration,
      );
    });
  });
});
