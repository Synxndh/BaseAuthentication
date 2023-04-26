import { RegisterDTO, UserDTO } from '../dto';
import { User } from '../entity/User';

export class EntityToDTO {
    public static userToDTO(data: User): UserDTO {
        const user: UserDTO = new UserDTO();
        user.id = data.id;
        user.email = data.email;
        user.username = data.username;
        user.password = data.password;
        user.age = data.age;

        return user;
    }
}
