import {json, NextFunction, Router} from "express";
import {Request, Response} from "express";
import {Event} from "../models/Event";

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

events.get("/src/:plz-:ortsname-:kategorieID-:systemID", async (req: Request, res: Response, next: NextFunction) => {
    let plz: string = req.params['plz'];
    let ortsname = req.params['ortsname'];
    let kategorieID = req.params['kategorieID'];
    let systemID = req.params['systemID'];

    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");




        console.log(plz + "/ " + ortsname + "/ " + kategorieID + "/ " + systemID);
        console.log(plz[0] + plz[1])
        res.json(await Event.findAll({
            where:{
                plzshort: (plz[0]+plz[1]),
                ortsname: ortsname,
                kategorieID: kategorieID,
                systemID: systemID
            }
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

});