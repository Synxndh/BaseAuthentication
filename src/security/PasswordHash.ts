import * as bcrypt from 'bcrypt';

export class PasswordHash {
    public static async hashPassword(password: string) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    public static isPasswordValid(password: string, hashedPassword: string) {
        return bcrypt.compare(password, hashedPassword);
    }
}
