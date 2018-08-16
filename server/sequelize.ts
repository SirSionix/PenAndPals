import {Sequelize} from 'sequelize-typescript';

export const sequelize =  new Sequelize({
    database: 'Server_db',
    dialect: 'sqlite',
    username: 'root',
    password: '',
    //storage: 'server/database.sqlite',
    modelPaths: [__dirname + '/models']
});