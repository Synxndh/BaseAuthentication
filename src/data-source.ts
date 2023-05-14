import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entity/User';
import { RefreshToken } from './entity/RefreshToken';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    // port: 5432,
    username: 'postgres',
    password: '123456',
    database: 'jwt-authorization',
    synchronize: true,
    logging: false,
    entities: [
        __dirname + './entity/User',
        __dirname + './entity/RefreshToken',
    ],
    migrations: [],
    subscribers: [],
    url: 'postgres://nsxezmpk:YowMKRNI8WBe2iFBCrwm5UUOtf0NkU7-@balarama.db.elephantsql.com/nsxezmpk',
});
