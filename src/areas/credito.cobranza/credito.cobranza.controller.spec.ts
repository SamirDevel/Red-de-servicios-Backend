import { Test, TestingModule } from '@nestjs/testing';
import { CreditoCobranzaController } from './credito.cobranza.controller';

describe('CreditoCobranzaController', () => {
  let controller: CreditoCobranzaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreditoCobranzaController],
    }).compile();

    controller = module.get<CreditoCobranzaController>(CreditoCobranzaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
