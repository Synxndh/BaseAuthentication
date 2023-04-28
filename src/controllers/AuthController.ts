import { AppDataSource } from '../data-source';
import {
    AuthenticationDTO,
    LoginDTO,
    RefreshTokenDTO,
    RegisterDTO,
    UserDTO,
} from '../dto';
import { RefreshToken } from '../entity/RefreshToken';
import { User } from '../entity/User';
import { JWT, PasswordHash } from '../security';
import { EntityToDTO } from '../utils/EntityToDTO';

export class AuthController {
    static register = async (req, res) => {
        try {
            const userRepository = AppDataSource.getRepository(User);
            const body: RegisterDTO = req.body;
            const authenticationDTO: AuthenticationDTO =
                new AuthenticationDTO();
            const userDTO: UserDTO = new UserDTO();

            if (body.password !== body.confirmPassword)
                throw new Error('Passwords does not match');

            if (await userRepository.findOneBy({ email: body.email }))
                throw new Error('Email is already in use');

            userDTO.email = body.email;
            userDTO.username = body.username;
            userDTO.password = await PasswordHash.hashPassword(body.password);
            userDTO.age = body.age;

            const result: User = await userRepository.save(userDTO);
            const tokenAndRefreshToken = await JWT.generateTokenAndRefreshToken(
                result,
            );

            authenticationDTO.user = EntityToDTO.userToDTO(result);
            authenticationDTO.token = tokenAndRefreshToken.token;
            authenticationDTO.refreshToken = tokenAndRefreshToken.refreshToken;

            res.json(authenticationDTO);
        } catch (error) {
            res.json({
                message: error.message,
            });
        }
    };

    static login = async (req, res) => {
        try {
            const body: LoginDTO = req.body;
            const userRepository = AppDataSource.getRepository(User);
            const result = await userRepository.findOneBy({
                email: body.email,
            });
            if (!result) throw new Error('Email does not exist');
            if (
                !(await PasswordHash.isPasswordValid(
                    body.password,
                    result.password,
                ))
            )
                throw new Error('Password is not match');
            const tokenAndRefreshToken = await JWT.generateTokenAndRefreshToken(
                result,
            );
            const authenticationDTO: AuthenticationDTO =
                new AuthenticationDTO();
            authenticationDTO.user = EntityToDTO.userToDTO(result);
            authenticationDTO.token = tokenAndRefreshToken.token;
            authenticationDTO.refreshToken = tokenAndRefreshToken.refreshToken;

            res.json(authenticationDTO);
        } catch (error) {
            res.json({
                message: error.message,
            });
        }
    };

    static refreshToken = async (req, res) => {
        try {
            const body: RefreshTokenDTO = req.body;
            const refreshTokenRepository =
                AppDataSource.getRepository(RefreshToken);
            const result: RefreshToken = await refreshTokenRepository.findOneBy(
                {
                    id: body.refreshToken,
                },
            );
            const jwtId: string = JWT.getJwtPayloadValueKey(body.token, 'jti');

            if (!JWT.isTokenValid(body.token))
                throw new Error('Token is not valid');
            if (!JWT.isRefreshTokenLinkedToToken(result, jwtId))
                throw new Error('Token is not match refresh token');
            if (JWT.isRefreshTokenExpired(result))
                throw new Error('Refresh token expired');
            if (JWT.isRefreshTokenUsedOrInvalid(result))
                throw new Error('Refresh token is used or invalid');

            result.used = true;
            await refreshTokenRepository.save(result);

            const userRepository = AppDataSource.getRepository(User);
            const userResult = await userRepository.findOneBy({
                id: JWT.getJwtPayloadValueKey(body.token, 'id'),
            });
            const tokenResult = await JWT.generateTokenAndRefreshToken(
                userResult,
            );
            const authenticationDTO: AuthenticationDTO =
                new AuthenticationDTO();
            authenticationDTO.user = EntityToDTO.userToDTO(userResult);
            authenticationDTO.token = tokenResult.token;
            authenticationDTO.refreshToken = tokenResult.refreshToken;

            res.json(authenticationDTO);
        } catch (error) {
            res.json({ message: error.message });
        }
    };
}
