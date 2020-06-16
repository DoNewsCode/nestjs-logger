import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { LOGGER, LOGGER_TYPE, LoggerInterface, LoggerModule } from '../lib';

describe('plain-logger.service test', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        LoggerModule.forRoot({
          loggerType: LOGGER_TYPE.PLAIN_MODEL,
          loggerLevel: 'verbose',
          context: 'test',
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('test', () => {
    const log = app.get<'string', LoggerInterface>(LOGGER);
    // 此输出依赖官方logger简版试下,普通启动和test启动不一样
    // 因为官方的test 方式启动 logger 不完整，test中删除了info,warn的输出，仅仅保留了error
    // sourcePath: @nestjs/testing/services/testing-logger.service.js
    log.info(JSON.stringify({ a: 1 }));
    log.warn(JSON.stringify({ a: 1 }));
    log.error(JSON.stringify({ a: 1 }));
  });

  it('just print ', () => {
    const log = app.get<'string', LoggerInterface>(LOGGER);
    log.error('error', 'error.stack', 'error');
    log.warn('warn', 'warn');
    log.log('log', 'log');
    log.info('info', 'info');
    log.debug('debug', 'debug');
    log.verbose('verbose', 'verbose');
  });

  it('regex print', () => {
    const log = app.get<'string', LoggerInterface>(LOGGER);
    log.setLogLevel('error');

    // debug 默认不显示
    log.debug('x', '');
    log.setLogContextRegex(['test']);
    log.debug(JSON.stringify({ test: 'x' }), 'test'); // 出

    log.setLogContextRegex(['test1']);
    log.debug(JSON.stringify({ test: 'y' }), 'test'); // 不出
    log.setLogContextRegex(['test2']);
    log.debug(JSON.stringify({ test: 'y' }), 'test'); // 不出
    log.debug(JSON.stringify({ test: 'z' }), 'test2'); // 出
  });

  it('module init regex inject test', async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        LoggerModule.forRoot({
          loggerType: LOGGER_TYPE.PLAIN_MODEL,
          loggerLevel: 'error',
          context: 'test',
          loggerContextList: ['regex test'],
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const log = app.get<'string', LoggerInterface>(LOGGER);

    log.debug('test', 's');
    log.debug('test', 'regex test');
  });
});
