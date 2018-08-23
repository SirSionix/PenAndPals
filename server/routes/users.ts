import {NextFunction, Router} from "express";
import {Request, Response} from "express";
import {User} from "../models/User";
import {compare, hash} from "bcrypt";
import {sign} from "jsonwebtoken";
import {checkAuth} from "../middleware/checkAuth"

export const users = Router();

let header = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'};


/**
 * @apiDefine UserSuccess
 *
 * @apiSuccess {number} id ID Des Users (Primary Key)
 * @apiSuccess {String} name Name des Users
 * @apiSuccess {String} email Emailaddresse des Users
 * @apiSuccess {string} password Das gehashte Password des Users
 *
 */

/**
 * @apiDefine UserSuccessExample
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 *            "id": 1,
 *            "name": "hans",
 *            "email": "hans@wurst.de",
 *            "password": "$2b$10$rPZLKZDi5s77wBDEnQ3xWOo.yhMXe1ublnsOOJKq5/UgQhMfHWAWm"
 *        }
 */

/**
 * @api {get} /users  Alle User ausgeben
 * @apiName GetUsers
 * @apiGroup User
 * @apiDescription Dieser request sorgt dafür dass alle User als JSON im Response ausgegeben werden.
 *
 * @apiUse UserSuccess
 * @apiUse UserSuccessExample
 *
 */

// Alle vorhandenen User abfragen
users.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        res.json(await User.findAll());
        
    } catch (e) {
        res.status(500).json({error: e});
        next(e);
    }
});

/**
 * @api {post} /users/new  Erstelle ein neues User
 * @apiName CreateNewUser
 * @apiGroup User
 * @apiDescription Dieser Request erstellt ein neuen User mit den mitgeleiferten Daten und speichert diesen in der Datenbank. Der Response ist das erstellte element
 *
 * @apiParam {String} name  Name des Users.
 * @apiParam {String} email  Emailaddresse des Users
 * @apiParam {String} password  Passwort des Users.
 *
 * @apiParamExample {json} Request-Example:
 *    {
 *        "name":"hans",
 *        "email":"hans@wurst.de",
 *        "password":"worscht"
 *    }
 *
 * @apiUse UserSuccess
 * @apiUse UserSuccessExample
 *
 */

// Neuen User erstellen nach der Definition in "User.ts"
users.post("/new", async (req: Request, res: Response, next: NextFunction) => {
   try {
       res.header("Access-Control-Allow-Origin", "*");
       res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

       hash(req.body.password,10,async (err, hash)=>{
           try {


               if (err) {
                   return res.status(500).json({error: err});
               } else {
                   let newUser = ({
                       name: req.body.name,
                       email: req.body.email,
                       password: hash
                   });
                   res.status(201).json(await User.create(newUser));
               }
           }catch (e) {
               res.status(500).json({error: e});
               next(e);
           }
       });

   } catch (e) {
       res.status(500).json({error: e});
       next(e);
   }
    //await sequelize.sync(/*{force: true}*/);
});

/**
 * @api {delete} /users/:id  Einen User löschen
 * @apiName DeleteUser
 * @apiGroup User
 * @apiExample {url} Beispielzutzung:
 *      http://localhost:3000/users/1
 * @apiDescription Dieser Request löscht den User mit der genannten ID
 *
 * @apiUse UserSuccess
 * @apiUse UserSuccessExample
 *
 */


//User wird anhand der ID gelöscht
users.delete("/:id", checkAuth, async (req: Request, res: Response, next: NextFunction) => {
   let id = req.params['id'];

   try {
       res.header("Access-Control-Allow-Origin", "*");
       res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

       let  user : User = await User.find(id);
       await User.destroy({
           where: {
               id: id
           }
       });
       res.status (200).json(user)
   } catch (e) {
       res.status(500).json({error: e});
       next(e);
   }
   // await sequelize.sync(/*{force: true}*/);
});


/**
 * @api {post} /users/login User login
 * @apiName LoginUser
 * @apiGroup User
 * @apiDescription mit diesem Request loggt sich der User ein und bekommt im Respons sein token
 *
 * @apiParam {String} email  Emailaddresse des Users
 * @apiParam {String} password  Passwort des Users.
 *
 * @apiParamExample {json} Request-Example:
 *    {
 *        "email":"hans@wurst.de",
 *        "password":"worscht"
 *    }
 *
 * @apiSuccess message Die Nachricht das der Login erfolgreich war
 * @apiSuccess name Name des Users
 * @apiSuccess token Das erstellte Token für den User
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *        {
 *            "message": "Authentifizierung erfolgreich",
 *            "name": "hans",
 *            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhhbnNAd3Vyc3QuZGUiLCJ1c2VySUQiOjEsImlhdCI6MTUzNTAzMDIxNywiZXhwIjoxNTM1MDMzODE3fQ.ZpdaSamixDhc3D24KpQ5P5DKTRTcgPZ_eNVKsam7LrY"
 *        }
 *
 */

users.post("/login", async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        let user:User = null;

        if (req.body.email) {
            if (user = await User.find(req.body.email)){
                compare(req.body.password, user.password,(err,result)=>{
                   if (err){
                       res.status(401).json({error: "Authentifizierung fehlgeschlagen"});
                   }else if(result){
                       let token = sign({
                           email: user.email,
                           userID: user.id
                       },"privateKey",{
                           expiresIn: "1h"
                       });

                       console.log(token);

                       res.status(200).json({
                           message: "Authentifizierung erfolgreich",
                           name: user.name,
                           token: token
                       });
                   }else{
                       res.status(401).json({error: "Authentifizierung fehlgeschlagen"});
                   }

                });
            }
            console.log(user.toJSON());
        }else{
            res.status(401).json({error: "Authentifizierung fehlgeschlagen"});
        }

    } catch (e) {
        res.status(500).json({error: e});
        next(e);
    }
});