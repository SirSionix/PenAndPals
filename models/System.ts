import {Column, HasMany, Model, PrimaryKey, Table} from "sequelize-typescript";
import {Event} from "./Event";

@Table
export class System extends Model<System> {

    @PrimaryKey
    @Column
    name : string;

    @Column
    beschreibung : string;

    @HasMany(() => Event )
    events: Event[];

}
