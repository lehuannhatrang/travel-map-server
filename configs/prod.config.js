export const ProdConfig = {
    PROFILE: 'production',
    AUTH_DB: {
        url: 'mongodb://mongodb:27017/guidy', options: {
            user: "",
            pass: "",
            useNewUrlParser: true
        }
    },
    URL_BACKEND: "https://guidy.com/api",
    URL_FRONTEND: "https://guidy.com",
    BASE_NAME: '/',
    ACCESS_CONTROL_ORIGIN: '*'
}