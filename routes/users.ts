import {NextFunction, Router} from "express";
import {Request, Response} from "express";
import {User} from "../models/User";

export const users = Router();


// Alle vorhandenen User abfragen
users.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.json(await User.findAll());
        
    } catch (e) {
        next(e);
    }
});

// Neuen User erstellen nach der Definition in "User.ts"
users.post("/new", async (req: Request, res: Response, next: NextFunction) => {
   try {
       let user : User = await User.create(req.body);
       res.status(201).json(user);
   } catch (e) {
       next(e);
   }
});

//User wird anhand der ID gelöscht
users.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
   let id = req.params['id'];

   try {
       let  user : User = await User.find(id);
       await User.destroy({
           where: {
               id: id
           }
       });
       res.status (200).json(user)
   } catch (e) {
       next (e);
   }

});