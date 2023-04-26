import { UserDTO } from './UserDTO';

export class AuthenticationDTO {
    user: UserDTO;
    token: string;
    refreshToken: string;
}
