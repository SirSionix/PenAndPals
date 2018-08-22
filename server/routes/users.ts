import {NextFunction, Router} from "express";
import {Request, Response} from "express";
import {User} from "../models/User";
import {compare, hash} from "bcrypt";
import {sign} from "jsonwebtoken";
import {checkAuth} from "../middleware/checkAuth"

export const users = Router();

let header = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'};

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

//User wird anhand der ID gelöscht
users.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
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

users.post("/login", async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        let user:User = null;

        if (req.body.email) {
            if (user = await User.find(req.body.email)){
                compare(req.body.password, user.password,(err,result)=>{
                   if (err){
                       res.status(401).json({error: "Autentifikation fehlgeschlagen"});
                   }else if(result){
                       let token = sign({
                           email: user.email,
                           userID: user.id
                       },"privateKey",{
                           expiresIn: "1h"
                       });

                       console.log(token);

                       res.status(200).json({
                           message: "Autentifikation erfolgreich",
                           token: token
                       });
                   }else{
                       res.status(401).json({error: "Autentifikation fehlgeschlagen"});
                   }

                });
            }
            console.log(user.toJSON());
        }else{
            res.status(401).json({error: "Autentifikation fehlgeschlagen"});
        }

    } catch (e) {
        res.status(500).json({error: e});
        next(e);
    }
});