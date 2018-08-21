import {Column, Model, Table} from "sequelize-typescript";

@Table
export class User extends Model<User> {
    @Column ({
        unique: true,
        allowNull: false
    })
    name : string;

    @Column ({
        unique: true,
        allowNull: false
    })
    email : string;

    @Column
    password: string;
}
