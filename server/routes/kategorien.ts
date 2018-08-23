import {NextFunction, Router} from "express";
import {Request, Response} from "express";
import {Kategorie} from "../models/Kategorie";
import {sequelize} from "../sequelize";

export const kategorien = Router();

let header = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'};

/**
 * @apiDefine KategorieSuccess
 *
 * @apiSuccess {String} name  Name der Kategorie.
 * @apiSuccess {String} beschreibung  Beschreibung der Kategorie.
 *
 */

/**
 * @apiDefine KategorieSuccessExample
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 *                "name": "Pen and Paper",
 *                "beschreibung": "am Tisch mit Stift und Papier"
 *        }
 */


/**
 * @api {get} /kategorien  Fordere alle Kategorien in der Datenbank an
 * @apiName GetKategorys
 * @apiGroup Kategorie
 * @apiDescription Dieser request sorgt dafür dass alle Kategorien als JSON im Response ausgegeben werden.
 *
 * @apiUse KategorieSuccess
 * @apiUse KategorieSuccessExample
 *
 */

// Alle vorhandenen Kategorie abfragen
kategorien.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {

        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        res.json(await Kategorie.findAll());
    } catch (e) {
        res.status(500).json({error: e});
        next(e);
    }
});

/**
 * @api {post} /kategorien/new  Erstelle eine neue Kategorie
 * @apiName CreateKategorys
 * @apiGroup Kategorie
 * @apiDescription Dieser request erstellt eine neue Kategorie.
 *
 * @apiParam {String} name  Name der Kategorie.
 * @apiParam {String} beschreibung  Beschreibung der Kategorie.
 * @apiParamExample {json} JSON-Request:
 *        {
 *                "name": "Pen and Paper",
 *                "beschreibung": "am Tisch mit Stift und Papier"
 *        }
 *
 * @apiUse KategorieSuccess
 * @apiUse KategorieSuccessExample
 *
 */

// Neuen Kategorie erstellen nach der Definition in "Kategorie.ts"
kategorien.post("/new", async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        let kategorie : Kategorie = await Kategorie.create(req.body);
        res.status(201).json(kategorie);
    } catch (e) {
        res.status(500).json({error: e});
        next(e);
    }
    // await sequelize.sync(/*{force: true}*/);
});

/**
 * @api {delete} /kategorien/:id  Lösche eine Kategorie
 * @apiName DeleteKategorys
 * @apiGroup Kategorie
 * @apiDescription Dieser request Löscht eine Kategorie mit der in der URL genannten ID.
 *
 * @apiParam {string} id Der name der Kategorie
 * @apiExample {url} Beispielzutzung:
 *      http://localhost:3000/kategorien/Pen and Paper
 *
 * @apiUse KategorieSuccess
 * @apiUse KategorieSuccessExample
 *
 */

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
        res.status(500).json({error: e});
        next(e);
    }
    // await sequelize.sync(/*{force: true}*/);
});