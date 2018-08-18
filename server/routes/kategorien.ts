import {NextFunction, Router} from "express";
import {Request, Response} from "express";
import {Kategorie} from "../models/Kategorie";
import {sequelize} from "../sequelize";

export const kategorien = Router();

let header = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'};

// Alle vorhandenen Kategorie abfragen
kategorien.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {

        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        res.json(await Kategorie.findAll());
    } catch (e) {
        next(e);
    }
});

// Neuen Kategorie erstellen nach der Definition in "Kategorie.ts"
kategorien.post("/new", async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        let kategorie : Kategorie = await Kategorie.create(req.body);
        res.status(201).json(kategorie);
    } catch (e) {
        next(e);
    }
    // await sequelize.sync(/*{force: true}*/);
});

//Kategorie wird anhand der ID gelöscht
kategorien.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params['id'];

    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        let  kategorie : Kategorie = await Kategorie.find(id);
        await Kategorie.destroy({
            where: {
                name: id
            }
        });
        res.status (200).json(kategorie)
    } catch (e) {
        next (e);
    }
    // await sequelize.sync(/*{force: true}*/);
});