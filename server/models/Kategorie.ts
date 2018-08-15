import {Column, HasMany, Model, PrimaryKey, Table} from "sequelize-typescript";
import {Event} from "./Event";

@Table
export class Kategorie extends Model<Kategorie> {
    @PrimaryKey
    @Column
    name : string;

    @Column
    beschreibung : string;

    @HasMany(() => Event )
    events: Event[];

}
