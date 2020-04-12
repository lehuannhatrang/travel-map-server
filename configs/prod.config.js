import path from 'path';
export const ProdConfig = {
    PROFILE: 'production',
    AUTH_DB: {
        url: 'mongodb://localhost:27017/guidy', options: {
            user: "",
            pass: "",
            useNewUrlParser: true
        }
    },
    URL_BACKEND: "https://guidy.com/api",
    URL_FRONTEND: "https://guidy.com",
    BASE_NAME: '/',
    CLIENT_PATH: path.resolve(__dirname, 'dist'),
    ACCESS_CONTROL_ORIGIN: '*',
    RECOMMENDER_SYSTEM_BASE_DIR: '/home/leehun/guidy/travel-map-recommendation-system',
    CRITERIA_BASED_SCRIPT: 'Criteria-Based_RS.py'
}