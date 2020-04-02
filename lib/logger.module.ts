import { DynamicModule, FactoryProvider, Global, Module } from '@nestjs/common';
import { LOGGER } from './constant';
import { JsonLoggerService, PlainLoggerService } from './services';

@Global()
@Module({})
export class LoggerModule {
  static forRoot(options: {
    loggerType: 'json' | 'plain';
    loggerLevel: string;
    context: string;
  }): DynamicModule {
    const providers: FactoryProvider[] = [];

    if (options.loggerType !== 'json' && options.loggerType !== 'plain') {
      throw new ReferenceError(
        `The logger type ${options.loggerType} is not supported`,
      );
    }

    let LoggerService: any;
    if (options.loggerType === 'json') {
      LoggerService = JsonLoggerService;
    }
    if (options.loggerType === 'plain') {
      LoggerService = PlainLoggerService;
    }

    const LoggerServiceProvider: FactoryProvider = {
      provide: LOGGER,
      useFactory: () => {
        const logInstance = new LoggerService(options.context);
        logInstance.setLogLevel(options.loggerLevel);
        return logInstance;
      },
    };
    providers.push(LoggerServiceProvider);

    return {
      module: LoggerModule,
      providers: providers,
      exports: providers,
    };
  }
}
