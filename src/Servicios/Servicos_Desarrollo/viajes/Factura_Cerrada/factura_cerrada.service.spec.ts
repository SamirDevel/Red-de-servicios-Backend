import { Test, TestingModule } from '@nestjs/testing';
import { FacturaCerradaService } from './factura_cerrada.service';

describe('FacturaCerradaService', () => {
  let service: FacturaCerradaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FacturaCerradaService],
    }).compile();

    service = module.get<FacturaCerradaService>(FacturaCerradaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
