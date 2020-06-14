import { DevConfig } from './dev.config';
import { DockerConfig } from './docker.config';
import { ProdConfig } from './prod.config';
import { CommonConfig } from './common.config';

let IndexConfig = ''
if(process.env.NODE_ENV === 'production') {
    IndexConfig = ProdConfig
} else {
    IndexConfig = DevConfig;    
}

export { IndexConfig, CommonConfig }
