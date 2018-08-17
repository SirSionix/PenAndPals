import {NextFunction, Router} from "express";
import {Request, Response} from "express";
import {System} from "../models/System";
import {sequelize} from "../sequelize";

export const systeme = Router();

let header = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'};

// Alle vorhandenen System abfragen
systeme.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        res.json(await System.findAll());

    } catch (e) {
        next(e);
    }

});

// Neuen System erstellen nach der Definition in "System.ts"
systeme.post("/new", async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        let system : System = await System.create(req.body);
        res.status(201).json(system);
    } catch (e) {
        next(e);
    }
    await sequelize.sync(/*{force: true}*/);
});

//System wird anhand der ID gelöscht
systeme.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params['id'];

    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        let  system : System = await System.find(id);
        await System.destroy({
            where: {
                name: id
            }
        });
        res.status (200).json(system)
    } catch (e) {
        next (e);
    }
    await sequelize.sync(/*{force: true}*/);
});