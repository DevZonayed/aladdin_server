import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Strategy } from '../entities/strategy.entity';
import { StrategyService } from './strategy.service';

describe('StrategyService', () => {
  let service: StrategyService;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StrategyService,
        {
          provide: getModelToken(Strategy.name),
          useValue: Model,
        },
      ],

    }).compile();

    service = module.get<StrategyService>(StrategyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
