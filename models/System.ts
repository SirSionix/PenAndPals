import {Column, Model, Table} from "sequelize-typescript";

@Table
export class System extends Model<System> {
    @Column
    name : string;

    @Column
    beschreibung : string;

}
