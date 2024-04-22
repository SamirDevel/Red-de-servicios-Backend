import { Test, TestingModule } from '@nestjs/testing';
import { AgenteDesService } from './agente-des.service';

describe('AgenteDesService', () => {
  let service: AgenteDesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgenteDesService],
    }).compile();

    service = module.get<AgenteDesService>(AgenteDesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
