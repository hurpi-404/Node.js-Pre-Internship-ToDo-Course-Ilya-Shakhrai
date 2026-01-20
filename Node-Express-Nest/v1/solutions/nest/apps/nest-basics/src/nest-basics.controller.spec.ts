import { Test, TestingModule } from '@nestjs/testing';
import { NestBasicsController } from './nest-basics.controller';
import { NestBasicsService } from './nest-basics.service';

describe('NestBasicsController', () => {
  let nestBasicsController: NestBasicsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [NestBasicsController],
      providers: [NestBasicsService],
    }).compile();

    nestBasicsController = app.get<NestBasicsController>(NestBasicsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(nestBasicsController.getHello()).toBe('Hello World!');
    });
  });
});
