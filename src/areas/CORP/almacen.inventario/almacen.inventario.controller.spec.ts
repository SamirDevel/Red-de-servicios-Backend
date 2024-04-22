import { Test, TestingModule } from '@nestjs/testing';
import { AlmacenInventarioController } from './almacen.inventario.controller';

describe('AlmacenInventarioController', () => {
  let controller: AlmacenInventarioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlmacenInventarioController],
    }).compile();

    controller = module.get<AlmacenInventarioController>(AlmacenInventarioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
