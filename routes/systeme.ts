import {NextFunction, Router} from "express";
import {Request, Response} from "express";
import {System} from "../models/System";

export const systeme = Router();


// Alle vorhandenen System abfragen
systeme.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.json(await System.findAll());

    } catch (e) {
        next(e);
    }
});

// Neuen System erstellen nach der Definition in "System.ts"
systeme.post("/new", async (req: Request, res: Response, next: NextFunction) => {
    try {
        let system : System = await System.create(req.body);
        res.status(201).json(system);
    } catch (e) {
        next(e);
    }
});

//System wird anhand der ID gelöscht
systeme.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params['id'];

    try {
        let  system : System = await System.find(id);
        await System.destroy({
            where: {
                id: id
            }
        });
        res.status (200).json(system)
    } catch (e) {
        next (e);
    }

});