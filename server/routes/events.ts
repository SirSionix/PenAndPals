import {NextFunction, Router} from "express";
import {Request, Response} from "express";
import {Event} from "../models/Event";
import {checkAuth} from "../middleware/checkAuth";

export const events = Router();


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
 * @apiDefine Authentifizierungheader
 *
 * @apiHeader {string} authorization Token
 * @apiHeaderExample {string} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhhbnNAd3Vyc3QuZGUiLCJ1c2VySUQiOjEsImlhdCI6MTUzNTAzMDIxNywiZXhwIjoxNTM1MDMzODE3fQ.ZpdaSamixDhc3D24KpQ5P5DKTRTcgPZ_eNVKsam7LrY"
 *     }
 */

/**
 * @apiDefine EventSuccessExample
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 *            "id": 5,
 *            "name": "Abenteuer in Aventurien die erste",
 *            "plz": "123456",
 *            "ortsname": "roemms",
 *            "straße": "Albrechtalee 200",
 *            "kontaktweg": "asdf@qwer.com",
 *            "beschreibung": "HAAAAAAAALLLLLLOOOOOOOOOO",
 *            "kategorieName": "Larp",
 *            "systemName": "DSA",
 *            "datum": "2018-09-10T15:30:00.000Z",
 *            "plzshort": "12"
 *        }
 */

/**
 * @api {get} /events  Alle Events ausgeben
 * @apiName GetEvents
 * @apiGroup Events
 * @apiDescription Dieser request sorgt dafür dass alle Events als JSON im Response ausgegeben werden.
 *
 * @apiUse EventSuccess
 * @apiUse EventSuccessExample
 *
 */

// Alle vorhandenen Event abfragen
events.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        res.status(200).json(await Event.findAll());

    } catch (e) {
        res.status(500).json({error: e});
        next(e);
    }
});

/**
 * @api {get} /events/src  Suche nach bestimmten Events
 * @apiName SearchEvents
 * @apiGroup Events
 * @apiExample {url} Beispielzutzung:
 *      http://localhost:3000/events/src?systemName=DSA&plzshort=12
 * @apiDescription Dieser Request sorgt für einen Response der alle Events hat die auf die quary passen beinhaltet
 *
 * @apiUse EventSuccess
 * @apiUse EventSuccessExample
 *
 */


events.get("/src", async (req: Request, res: Response, next: NextFunction) => {

    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        res.status(200).json(await Event.findAll({
            where: req.query
        }));

    } catch (e) {
        res.status(500).json({error: e});
        next(e);
    }
});

/**
 * @api {post} /events/new  Erstelle ein neues Event
 * @apiName CreateNewEvent
 * @apiGroup Events
 * @apiDescription Dieser Request erstellt ein neues Event mit den mitgeleiferten Daten und speichert diesen in der Datenbank. Der Response ist das erstellte element
 *
 * @apiUse Authentifizierungheader
 *
 * @apiParam {String} name  Name of the Event.
 * @apiParam {String} plz  PLZ des Ortes wo das Event stattfinden soll.
 * @apiParam {String} ortsname  Ortsname des Ortes wo das Event stattfinden soll.
 * @apiParam {String} straße  Straße + Hausnummer wo das Event stattfinden soll.
 * @apiParam {String} beschreibung  Beschreibung des Events.
 * @apiParam {String} kategorieName  Die Kategorie des Eventes (z.B. Larp)(Foreign Kes aus der entsprechenden Kategorie).
 * @apiParam {String} systemName  Das Kategorie des Eventes (z.B. DSA)(Foreign Kes aus der entsprechenden System)
 * @apiParam {Date} datum  Datum an dem das event stattfinden soll.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       	"name": "Abenteuer in Aventurien die erste",
 *	        "plz": "123456",
 *	        "ortsname": "roemms",
 *	        "straße": "Albrechtalee 200",
 *	        "kontaktweg": "asdf@qwer.com",
 *	        "beschreibung": "HAAAAAAAALLLLLLOOOOOOOOOO",
 *	        "kategorieName": "Larp",
 *	        "systemName": "DSA",
 *	        "datum": "2018-09-10T17:30"
 *     }
 *
 * @apiUse EventSuccess
 * @apiUse EventSuccessExample
 *
 */

// Neuen Event erstellen nach der Definition in "Event.ts"
events.post("/new", checkAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        req.body.plzshort = req.body.plz[0]+req.body.plz[1];

        let event : Event = await Event.create(req.body);
        res.status(200).json(event);
    } catch (e) {
        res.status(500).json({error: e});
        next(e);
    }
   // await sequelize.sync(/*{force: true}*/);
});

/**
 * @api {delete} /events/:id  Ein Event löschen
 * @apiName DeleteEvent
 * @apiGroup Events
 * @apiExample {url} Beispielzutzung:
 *      http://localhost:3000/events/1
 * @apiDescription Dieser Request löscht das Event mit der genannten ID
 *
 * @apiUse EventSuccess
 * @apiUse EventSuccessExample
 *
 */

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