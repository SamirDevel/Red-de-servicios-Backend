import { Test, TestingModule } from '@nestjs/testing';
import { RecursosHumanosService } from './recursos.humanos.service';

describe('RecursosHumanosService', () => {
  let service: RecursosHumanosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecursosHumanosService],
    }).compile();

    service = module.get<RecursosHumanosService>(RecursosHumanosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
