import { AppDataSource } from './data-source';
import { AuthenticationDTO, LoginDTO, RegisterDTO, UserDTO } from './dto';
import { User } from './entity/User';
import * as express from 'express';
import { EntityToDTO } from './utils/EntityToDTO';
import { JWT, PasswordHash } from './security';

const app = express();
const port = 3000;

app.use(express.json());

AppDataSource.initialize()
    .then(() => console.log('Connect to database done'))
    .catch((error) => console.log('Connect to database error: ' + error));

app.post('/api/jwt/register', async (req, res) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const body: RegisterDTO = req.body;
        const authenticationDTO: AuthenticationDTO = new AuthenticationDTO();
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

        authenticationDTO.user = EntityToDTO.userToDTO(result);
        authenticationDTO.token = await JWT.generateTokenAndRefreshToken(
            result,
        );
        authenticationDTO.refreshToken = '';

        res.json(authenticationDTO);
    } catch (error) {
        res.json({
            message: error.message,
        });
    }
});

app.post('/api/jwt/login', (req, res) => {});
app.post('/api/jwt/refresh-token', (req, res) => {});

app.listen(port, () => console.log('App listening on port ' + port));
