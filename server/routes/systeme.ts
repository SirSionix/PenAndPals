import {NextFunction, Router} from "express";
import {Request, Response} from "express";
import {System} from "../models/System";
import {sequelize} from "../sequelize";

export const systeme = Router();

let header = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'};


/**
 * @apiDefine SystemSuccess
 *
 * @apiSuccess {String} name  Name der Kategorie.
 * @apiSuccess {String} beschreibung  Beschreibung der Kategorie.
 *
 */

/**
 * @apiDefine SystemSuccessExample
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 *                "name": "DSA",
 *                "beschreibung": "Das Schwarze Auge (Fantasy)"
 *        }
 */


/**
 * @api {get} /systeme  Fordere alle Systeme in der Datenbank an
 * @apiName GetSystems
 * @apiGroup System
 * @apiDescription Dieser request sorgt dafür dass alle Systeme als JSON im Response ausgegeben werden.
 *
 * @apiUse SystemSuccess
 * @apiUse SystemSuccessExample
 *
 */


// Alle vorhandenen System abfragen
systeme.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        res.json(await System.findAll());

    } catch (e) {
        res.status(500).json({error: e});
        next(e);
    }

});

/**
 * @api {post} /systeme/new  Erstelle ein neues System
 * @apiName CreateSystems
 * @apiGroup System
 * @apiDescription Dieser request erstellt ein neues System.
 *
 * @apiParam {String} name  Name des Systems.
 * @apiParam {String} beschreibung  Beschreibung des Systems.
 * @apiParamExample {json} JSON-Request:
 *        {
 *                "name": "DSA",
 *                "beschreibung": "Das Schwarze Auge (Fantasy)"
 *        }
 *
 * @apiUse KategorieSuccess
 * @apiUse KategorieSuccessExample
 *
 */

// Neuen System erstellen nach der Definition in "System.ts"
systeme.post("/new", async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        let system : System = await System.create(req.body);
        res.status(201).json(system);
    } catch (e) {
        res.status(500).json({error: e});
        next(e);
    }
    // await sequelize.sync(/*{force: true}*/);
});

/**
 * @api {delete} /system/:id  Lösche ein System
 * @apiName DeleteSystem
 * @apiGroup System
 * @apiDescription Dieser request Löscht ein System mit der in der URL genannten ID.
 *
 * @apiParam {string} id Der name des Systems
 * @apiExample {url} Beispielzutzung:
 *      http://localhost:3000/system/DSA
 *
 * @apiUse SystemSuccess
 * @apiUse SystemSuccessExample
 *
 */

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
        res.status(500).json({error: e});
        next(e);
    }
    // await sequelize.sync(/*{force: true}*/);
});