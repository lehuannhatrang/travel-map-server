import { DevConfig } from './dev.config';
import { DockerConfig } from './docker.config';
import { ProdConfig } from './prod.config';
import { CommonConfig } from './common.config';

let IndexConfig = ''
if(process.env.NODE_ENV === 'docker') {
    IndexConfig = DockerConfig
} else {
    IndexConfig = (process.env.NODE_ENV === 'production') ? ProdConfig : DevConfig;    
}

export { IndexConfig, CommonConfig }
