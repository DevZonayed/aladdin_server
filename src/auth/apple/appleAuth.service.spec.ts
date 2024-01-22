import { Test, TestingModule } from '@nestjs/testing';
import { AppleAuthService } from './appleAuth.service';

describe('AppleAuthService', () => {
  let service: AppleAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppleAuthService],
    }).compile();

    service = module.get<AppleAuthService>(AppleAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
