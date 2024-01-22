import { Test, TestingModule } from '@nestjs/testing';
import { AppleAuthController } from './appleAuth.controller';
import { AppleAuthService } from './appleAuth.service';

describe('AppleAuthController', () => {
  let controller: AppleAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppleAuthController],
      providers: [AppleAuthService],
    }).compile();

    controller = module.get<AppleAuthController>(AppleAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
