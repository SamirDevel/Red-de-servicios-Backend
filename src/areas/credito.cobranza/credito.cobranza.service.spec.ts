import { Test, TestingModule } from '@nestjs/testing';
import { CreditoCobranzaService } from './credito.cobranza.service';

describe('CreditoCobranzaService', () => {
  let service: CreditoCobranzaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreditoCobranzaService],
    }).compile();

    service = module.get<CreditoCobranzaService>(CreditoCobranzaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
