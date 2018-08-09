import {NextFunction, Router} from "express";
import {Request, Response} from "express";
import {Kategorie} from "../models/Kategorie";

export const kategorien = Router();


// Alle vorhandenen Kategorie abfragen
kategorien.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.json(await Kategorie.findAll());

    } catch (e) {
        next(e);
    }
});

// Neuen Kategorie erstellen nach der Definition in "Kategorie.ts"
kategorien.post("/new", async (req: Request, res: Response, next: NextFunction) => {
    try {
        let kategorie : Kategorie = await Kategorie.create(req.body);
        res.status(201).json(kategorie);
    } catch (e) {
        next(e);
    }
});

//Kategorie wird anhand der ID gelöscht
kategorien.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params['id'];

    try {
        let  kategorie : Kategorie = await Kategorie.find(id);
        await Kategorie.destroy({
            where: {
                id: id
            }
        });
        res.status (200).json(kategorie)
    } catch (e) {
        next (e);
    }

});