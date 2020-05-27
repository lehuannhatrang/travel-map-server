import path from 'path';
export const DockerConfig = {
    PROFILE: 'docker',
    AUTH_DB: {
        url: 'mongodb://mongodb:27017/guidy', options: {
            user: "",
            pass: "",
            useNewUrlParser: true
        }
    },
    URL_BACKEND: "http://travelmap.com:5001",
    URL_FRONTEND: "http://travelmap.com",
    BASE_NAME: '/',
    CLIENT_PATH: path.resolve(__dirname, 'dist'),
    ACCESS_CONTROL_ORIGIN: '*',
    RECOMMENDER_SERVICE_URL: 'http://localhost:8086'
}

//create folder if not exist