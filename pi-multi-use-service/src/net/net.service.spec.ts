import { Test, TestingModule } from '@nestjs/testing';
import { NetService } from './net.service';

describe('NetService', () => {
  let service: NetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NetService],
    }).compile();

    service = module.get<NetService>(NetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
