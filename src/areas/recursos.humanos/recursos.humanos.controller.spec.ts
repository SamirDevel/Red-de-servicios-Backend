import { Test, TestingModule } from '@nestjs/testing';
import { RecursosHumanosController } from './recursos.humanos.controller';

describe('RecursosHumanosController', () => {
  let controller: RecursosHumanosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecursosHumanosController],
    }).compile();

    controller = module.get<RecursosHumanosController>(RecursosHumanosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
