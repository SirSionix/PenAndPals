import {BelongsTo, Column, CreatedAt, ForeignKey, Model, Table} from "sequelize-typescript";
import {Kategorie} from "./Kategorie"
import {System} from "./System";
import * as sequelize from "sequelize";

@Table
export class Event extends Model<Event> {
    @Column
    name : string;

    @Column
    plz : string;

    @Column
    ortsname : string;

    @Column
    straße: string;

    @Column
    kontaktweg : string;

    @Column
    beschreibung: string;

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
    datum: Date;

    @Column
    plzshort: string;
}
