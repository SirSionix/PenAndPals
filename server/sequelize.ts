import {Sequelize} from 'sequelize-typescript';

export const sequelize =  new Sequelize({
    database: 'Server_db',
    dialect: 'sqlite',
    username: 'root',
    password: '',
    logging: false,
    storage: 'server/database.sqlite',
    operatorsAliases: false,
    modelPaths: [__dirname + '/models']
});