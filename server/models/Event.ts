import {BelongsTo, Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {Kategorie} from "./Kategorie"
import {System} from "./System";

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

    @ForeignKey(()=> Kategorie)
    @Column
    kategorieName: string;

    @BelongsTo(()=> Kategorie)
    kategorie : Kategorie;

    @ForeignKey(()=> System)
    @Column
    systemName: string;

    @BelongsTo(()=> System)
    system : System;

    @Column
    plzshort: string;
}
