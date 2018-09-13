import { environment } from '../../../environments/environment';

import { IURLConfig } from './url.interface';
import { DEVURLConfiguration } from './url.config.dev';
import { PRODURLConfiguration } from './url.config.prod';

let config: IURLConfig = (environment.envName === 'dev' ? DEVURLConfiguration : PRODURLConfiguration);

export const URLConfig: IURLConfig = config;
