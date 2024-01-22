import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Strategy } from '../entities/strategy.entity';
import { StrategyService } from '../service/strategy.service';
import { StrategyController } from './strategy.controller';

describe('StrategyController', () => {
  let controller: StrategyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StrategyController],
      providers: [StrategyService,
        {
          provide: getModelToken(Strategy.name),
          useValue: Model,
        },
        {
          provide: JwtService,
          useValue: { signAsync: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<StrategyController>(StrategyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
