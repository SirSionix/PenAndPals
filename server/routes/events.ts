import {json, NextFunction, Router} from "express";
import {Request, Response} from "express";
import {Event} from "../models/Event";
import {sequelize} from "../sequelize";
import {checkAuth} from "../middleware/checkAuth";

export const events = Router();

let header = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'};

/**
 * @apiDefine EventSuccess
 *
 * @apiSuccess {number} id ID of the Event (Primary Key).
 * @apiSuccess {String} name  Name of the Event.
 * @apiSuccess {String} plz  PLZ des Ortes wo das Event stattfinden soll.
 * @apiSuccess {String} ortsname  Ortsname des Ortes wo das Event stattfinden soll.
 * @apiSuccess {String} straße  Straße + Hausnummer wo das Event stattfinden soll.
 * @apiSuccess {String} beschreibung  Beschreibung des Events.
 * @apiSuccess {String} kategorieName  Die Kategorie des Eventes (z.B. Larp)(Foreign Kes aus der entsprechenden Kategorie).
 * @apiSuccess {String} systemName  Das Kategorie des Eventes (z.B. DSA)(Foreign Kes aus der entsprechenden System)
 * @apiSuccess {Date} datum  Datum an dem das event stattfinden soll.
 * @apiSuccess {string} plzshort  Die ersten 2 Ziffern der PLZ welche bei der suche verwendet werden.
 *
 */

/**
 * @api {get} /events  Request all Events from the database
 * @apiName GetEvents
 * @apiGroup Events
 * @apiDescription Dieser request sorgt dafür dass alle Events als JSON im Response ausgegeben werden.
 *
 * @apiUse EventSuccess
 *
 */

// Alle vorhandenen Event abfragen
events.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        res.json(await Event.findAll());

    } catch (e) {
        res.status(500).json({error: e});
        next(e);
    }
});

/**
 * @api {get} /events/src  Suche nach bestimmten Events
 * @apiName SearchEvents
 * @apiGroup Events
 * @apiDescription Dieser request Dieser Request dorgt für einen Response der alle Events hat die auf die quary passen beinhaltet
 *
 * @apiUse EventSuccess
 *
 */


events.get("/src", async (req: Request, res: Response, next: NextFunction) => {

    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        res.json(await Event.findAll({
            where: req.query
        }));

    } catch (e) {
        res.status(500).json({error: e});
        next(e);
    }
});

// Neuen Event erstellen nach der Definition in "Event.ts"
events.post("/new", checkAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        req.body.plzshort = req.body.plz[0]+req.body.plz[1];

        let event : Event = await Event.create(req.body);
        res.status(201).json(event);
    } catch (e) {
        res.status(500).json({error: e});
        next(e);
    }
   // await sequelize.sync(/*{force: true}*/);
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
        res.status(500).json({error: e});
        next (e);
    }
   // await sequelize.sync(/*{force: true}*/);
});