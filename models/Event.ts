import {Column, Model, Table} from "sequelize-typescript";

@Table
export class Event extends Model<Event> {
    @Column
    name : string;

    @Column
    plz : string;

    @Column
    ortsname : string;

    @Column
    kontaktweg : string;

    @Column
    kategorie : string;

    @Column
    system : string;
}
