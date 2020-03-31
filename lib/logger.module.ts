import { DynamicModule, FactoryProvider, Module } from '@nestjs/common';
import { LOGGER } from './constant';
import { JsonLoggerService, PlainLoggerService } from './services';

@Module({})
export class LoggerModule {
  static forRoot(options: {
    loggerType: string;
    loggerLevel: string;
    context: string;
  }): DynamicModule {
    const providers: FactoryProvider[] = [];

    if (
      options.loggerType !== JsonLoggerService.name &&
      options.loggerType !== PlainLoggerService.name
    ) {
      throw new ReferenceError(
        `The logger type ${options.loggerType} is not supported`,
      );
    }

    let LoggerService: any;
    if (options.loggerType === JsonLoggerService.name) {
      LoggerService = JsonLoggerService;
    }
    if (options.loggerType === PlainLoggerService.name) {
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
