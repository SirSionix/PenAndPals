import {Column, Model, Table} from "sequelize-typescript";

@Table
export class Kategorie extends Model<Kategorie> {
    @Column
    name : string;

    @Column
    beschreibung : string;

}
