export const Error = {
    NOT_AUTHENTICATE: 'NOT_AUTHENTICATE',
    WRONG_USER: 'WRONG_USER',
    WRONG_USERNAME_PASSWORD: 'WRONG_USERNAME_PASSWORD',
    UN_AUTHORIZATION: 'UN_AUTHORIZATION',
    ITEM_NOT_FOUND: 'ITEM_NOT_FOUND',
    ACCOUNT_DISABLED: 'ACCOUNT_DISABLED',
    SESSION_EXPIRED: 'SESSION_EXPIRED',
    BAD_REQUEST: 'BAD_REQUEST',
    UNKNOWN: 'UNKNOWN'
}

const ErrorMessage = {
    NOT_AUTHENTICATE: {
        status: 403,
        message: 'Please login',
    },
    WRONG_USER: {
        status: 400,
        message: 'Wrong User',
    },
    WRONG_USERNAME_PASSWORD:{
        status: 400,
        message: 'Wrong Username or Password'
    },
    UN_AUTHORIZATION: {
        status: 401,
        message: 'Unauthorized',
    },
    ITEM_NOT_FOUND: {
        status: 500,
        message: 'Item not found',
    },
    ACCOUNT_DISABLED: {
        status: 403,
        message: 'Account is disabled. Please contact with Admin',
    },
    SESSION_EXPIRED: {
        status: 401,
        message: 'Session Expired',
    },
    UNKNOWN: {
        status: 500,
        message: 'Something went wrong',
    },
    BAD_REQUEST: {
        status: 400,
        message: 'Bad request',
    }
}

export function createError(code, message) {
    const keys = Object.keys(Error);
    if ( keys.filter(key => key[code] === code) && message) {
        return {
            success: false,
            code,
            message,
            status: ErrorMessage[code].status,
        }
    }
    const errorCode = Error[code] ? Error[code] : 'UNKNOWN';
    const msg = message ? message : ErrorMessage[errorCode].message;
    const status = ErrorMessage[errorCode].status;
    return {
        success: false,
        code: errorCode,
        message: msg,
        status,
    }
}
