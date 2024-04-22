import { Test, TestingModule } from '@nestjs/testing';
import { EsquemasVehiculoService } from './esquemas.vehiculo.service';

describe('EsquemasVehiculoService', () => {
  let service: EsquemasVehiculoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EsquemasVehiculoService],
    }).compile();

    service = module.get<EsquemasVehiculoService>(EsquemasVehiculoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
