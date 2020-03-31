import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { LOGGER, LoggerInterface, LoggerModule } from '../lib';

describe('plain-logger.service test', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        LoggerModule.forRoot({
          loggerType: 'plain',
          loggerLevel: 'debug',
          context: 'test',
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('test', () => {
    let log = app.get<'string', LoggerInterface>(LOGGER);
    // 此输出依赖官方logger简版试下,普通启动和test启动不一样
    // 因为官方的test 方式启动 logger 不完整，test中删除了info,warn的输出，仅仅保留了error
    // sourcePath: @nestjs/testing/services/testing-logger.service.js
    log.info(JSON.stringify({ a: 1 }));
    log.warn(JSON.stringify({ a: 1 }));
    log.error(JSON.stringify({ a: 1 }));
  });
});
