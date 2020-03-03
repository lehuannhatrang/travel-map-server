import path from 'path';
export const DevConfig = {
    PROFILE: 'dev',
    AUTH_DB: {
        url: 'mongodb://localhost:27017/guidy', options: {
            user: "",
            pass: "",
            useNewUrlParser: true
        }
    },
    URL_BACKEND: "http://localhost:5001",
    URL_FRONTEND: "http://localhost:5000",
    BASE_NAME: '/',
    CLIENT_PATH: path.resolve(__dirname, 'dist'),
    ACCESS_CONTROL_ORIGIN: '*',
    RECOMMENDER_SYSTEM_BASE_DIR: '/home/lap11735/Huan/thesis/travel-map-recommendation-system',
    CRITERIA_BASED_SCRIPT: 'Criteria_Based-RS.py'
}

//create folder if not exist