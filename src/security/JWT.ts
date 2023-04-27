import { User } from '../entity/User';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { AppDataSource } from '../data-source';
import { RefreshToken } from '../entity/RefreshToken';
import * as moment from 'moment';

export class JWT {
    private static JWT_SECRET = '0123456789';
    public static async generateTokenAndRefreshToken(user: User) {
        const payload = {
            id: user.id,
            email: user.email,
        };
        const jwtId = uuidv4();
        const token = jwt.sign(payload, this.JWT_SECRET, {
            expiresIn: '1h',
            jwtid: jwtId,
            subject: user.id.toString(),
        });

        const refreshTokenRepository =
            AppDataSource.getRepository(RefreshToken);
        const refreshToken: RefreshToken = new RefreshToken();
        refreshToken.user = user;
        refreshToken.jwtId = jwtId;
        refreshToken.expiryDate = moment().add(10, 'd').toDate();
        const result = await refreshTokenRepository.save(refreshToken);

        return {
            token,
            refreshToken: result.id,
        };
    }
}
