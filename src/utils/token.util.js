import jwt from 'jsonwebtoken';
import { CommonConfig } from '../../configs';

class TokenUtil {
    static async decodeToken(token, key) {
        try {
            return await jwt.verify(token, key);
        } catch (e) {
            throw new Error('Your Session expired. Sign in again');
        }

    }

    static async createToken(user, secret) {
        //can get role
        const { id, userId } = user;
        return await jwt.sign({ sub: id, userId: userId }, secret, { expiresIn: CommonConfig.MAX_AGE_SESSION });
    }

    static encodingAppToken(token) {
        if (token.length > 8) {
            return `${token.slice(0, 4)}***${token.slice(token.length - 4, token.length)}`;
        } else {
            return '***'
        }
    }
}

export default TokenUtil;