import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { LOGGER, LoggerInterface, LoggerModule } from '../lib';

describe('json-logger.service.spec', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        LoggerModule.forRoot({
          loggerType: 'json',
          loggerLevel: 'verbose',
          context: 'test',
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('test', () => {
    let log = app.get<'string', LoggerInterface>(LOGGER);
    log.info(JSON.stringify({ a: 1 }));
  });

  it('just print ', () => {
    let log = app.get<'string', LoggerInterface>(LOGGER);
    log.error('error', 'error.stack', 'error');
    log.warn('warn', 'warn');
    log.log('log', 'log');
    log.info('info', 'info');
    log.debug('debug', 'debug');
    log.verbose('verbose', 'verbose');
  });
});
