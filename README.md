# nest logger module

## 描述

基于`winston`和 nest`内置logger`的[Nest](https://github.com/nestjs/nest)日志 module。

1. json 格式输出输出基于[winston](https://github.com/winstonjs/winston)
2. plain 格式输出基于 nest 内置 logger

## Install

```bash
$ npm i @donews/nestjs-logger
```

## Quick Start

假定一个目录结构

```
/root
    /src
        app.module.ts
```

### 1. 模块导入

```typescript
import { LoggerModule } from '@donews/nestjs-logger';
import { Module } from '@nestjs/common';
import { LOGGER_TYPE } from './constant';

@Module({
  imports: [
    LoggerModule.forRoot({
      loggerType: LOGGER_TYPE.JSON_MODEL,
      loggerLevel: 'debug',
      context: 'text',
    }),
  ],
})
export class AppModule {}
```

### 2. 增加 asynchronous provider

```typescript
LoggerModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    loggerType: configService.get('loggerType'),
    loggerLevel: 'debug',
    context: 'text',
  }),
  inject: [ConfigService],
});
```

### 3. 使用

```typescript
import { LoggerInterface, LOGGER } from '@donews/nestjs-logger';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
class TestService {
  constructor(
    @Inject(LOGGER)
    private readonly loggerService: LoggerInterface,
  ) {}

  say() {
    this.loggerService.info('message', 'context');
    this.loggerService.error('error', 'trace', 'context');
  }
}
```

## License

Nest is [MIT licensed](LICENSE).
