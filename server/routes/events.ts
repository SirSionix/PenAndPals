import {json, NextFunction, Router} from "express";
import {Request, Response} from "express";
import {Event} from "../models/Event";
import {sequelize} from "../sequelize";

export const events = Router();

let header = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'};

// Alle vorhandenen Event abfragen
events.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        res.json(await Event.findAll());

    } catch (e) {
        next(e);
    }
});

events.get("/src", async (req: Request, res: Response, next: NextFunction) => {

    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");


        res.json(await Event.findAll({
            where: req.query
        }));

    } catch (e) {
        next(e);
    }
});

// Neuen Event erstellen nach der Definition in "Event.ts"
events.post("/new", async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        req.body.plzshort = req.body.plz[0]+req.body.plz[1];

        let event : Event = await Event.create(req.body);
        res.status(201).json(event);
    } catch (e) {
        next(e);
    }
    await sequelize.sync(/*{force: true}*/);
});

//Event wird anhand der ID gelöscht
events.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params['id'];

    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        let  event : Event = await Event.find(id);
        await Event.destroy({
            where: {
                id: id
            }
        });
        res.status (200).json(event)
    } catch (e) {
        next (e);
    }
    await sequelize.sync(/*{force: true}*/);
});