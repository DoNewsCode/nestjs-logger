import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  getJson(): 'json' {
    return 'json';
  }
  getPlain(): 'plain' {
    return 'plain';
  }
}
