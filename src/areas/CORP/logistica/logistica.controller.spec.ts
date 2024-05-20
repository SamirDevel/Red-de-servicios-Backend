import { Test, TestingModule } from '@nestjs/testing';
import { LogisticaController } from './logistica.controller';

describe('LogisticaController', () => {
  let controller: LogisticaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogisticaController],
    }).compile();

    controller = module.get<LogisticaController>(LogisticaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
