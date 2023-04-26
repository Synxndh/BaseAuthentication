import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class RefreshToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    jwtId: string;

    @Column({ default: false })
    used: boolean;

    @Column({ default: false })
    invalidated: boolean;

    @Column()
    expiryDate: Date;

    @CreateDateColumn()
    creationDate: Date;

    @UpdateDateColumn()
    updateDate: Date;

    @ManyToOne((type) => User, (user) => user.refreshTokens)
    user: User;
}
