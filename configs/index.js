import { DevConfig } from './dev.config';
import { DevDockerConfig } from './dev.docker.config';
import { ProdConfig } from './prod.config';
import { CommonConfig } from './common.config';

const IndexConfig = (process.env.NODE_ENV === 'production') ? ProdConfig : DevConfig;    

export { IndexConfig, CommonConfig }
