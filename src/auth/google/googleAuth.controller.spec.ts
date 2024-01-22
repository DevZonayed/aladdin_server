import { Test, TestingModule } from '@nestjs/testing';
import { GoogleAuthController } from './googleAuth.controller';
import { GoogleAuthService } from './googleAuth.service';

describe('GoogleAuthController', () => {
  let controller: GoogleAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoogleAuthController],
      providers: [GoogleAuthService],
    }).compile();

    controller = module.get<GoogleAuthController>(GoogleAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
