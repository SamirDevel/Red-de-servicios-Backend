import { Test, TestingModule } from '@nestjs/testing';
import { AlmacenInventarioService } from './almacen.inventario.service';

describe('AlmacenInventarioService', () => {
  let service: AlmacenInventarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlmacenInventarioService],
    }).compile();

    service = module.get<AlmacenInventarioService>(AlmacenInventarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
