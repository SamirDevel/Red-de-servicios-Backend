import { Test, TestingModule } from '@nestjs/testing';
import { PickingService } from './picking.service';

describe('PickingService', () => {
  let service: PickingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PickingService],
    }).compile();

    service = module.get<PickingService>(PickingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
