import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RefreshToken } from './RefreshToken';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    age: number;

    @OneToMany((type) => RefreshToken, (refreshToken) => refreshToken.user)
    refreshTokens: RefreshToken;
}
