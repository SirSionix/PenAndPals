import {NextFunction, Router} from "express";
import {Request, Response} from "express";
import {Event} from "../models/Event";

export const events = Router();


// Alle vorhandenen Event abfragen
events.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.json(await Event.findAll());

    } catch (e) {
        next(e);
    }
});

// Neuen Event erstellen nach der Definition in "Event.ts"
events.post("/new", async (req: Request, res: Response, next: NextFunction) => {
    try {
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