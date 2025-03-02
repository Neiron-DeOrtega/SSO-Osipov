import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sso_osipov',
    synchronize: true, 
    logging: false,
    entities: [`${__dirname}/entities/*.ts`], 
    migrations: [`${__dirname}/migrations/*.ts`],
});
