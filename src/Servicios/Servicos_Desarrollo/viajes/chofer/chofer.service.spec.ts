import { Test, TestingModule } from '@nestjs/testing';
import { ChoferService } from './chofer.service';

describe('ChoferService', () => {
  let service: ChoferService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChoferService],
    }).compile();

    service = module.get<ChoferService>(ChoferService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
