import {verify} from "jsonwebtoken";
import {Request, Response, NextFunction} from "express";

export function checkAuth(req: Request, res: Response, next: NextFunction) {
    try {
        if (req.headers.authorization) {
            let token = req.headers.authorization.split(" ")[1];
            let decoded = verify(token, "privateKey");
            //req.userData = decoded;
            next();
        } else {
            res.status(401).json({error: "Authentifizierung fehlgeschlagen"});
        }
    } catch (e) {
        res.status(500).json({error: e});
        next(e);
    }
}