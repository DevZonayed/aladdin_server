import { Test, TestingModule } from '@nestjs/testing';
import { FacebookAuthController } from './facebookAuth.controller';
import { FacebookAuthService } from './facebookAuth.service';

describe('FacebookAuthController', () => {
  let controller: FacebookAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FacebookAuthController],
      providers: [FacebookAuthService],
    }).compile();

    controller = module.get<FacebookAuthController>(FacebookAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
