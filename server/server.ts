import * as express from "express";
import {Request, Response} from "express";
import * as bodyParser from "body-parser";
import {users} from "./routes/users";
import {createServer} from "http";
import {sequelize} from "./sequelize";
import {events} from "./routes/events";
import {kategorien} from "./routes/kategorien";
import {systeme} from "./routes/systeme";

// später entfernen
import {Kategorie} from "./models/Kategorie";
import * as path from "path";

export const app = express();


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit: '5mb'}));

app.get('/', (req: Request, res: Response) => {
    res.header( 'Content-Type', 'text/html');
    res.sendFile(path.join(__dirname + '/../client/Startseite.html'));
});

app.get('/login', (req: Request, res: Response) => {
    res.header( 'Content-Type', 'text/html');
    res.sendFile(path.join(__dirname + '/../client/Einloggen.html'));
});

app.use('/assets', express.static(__dirname + '/../client/assets'));

app.use('/users', users);
app.use('/events', events);
app.use('/kategorien', kategorien);
app.use('/systeme', systeme);

// Beispieldaten einfügen
/*(async () => {
    try {
        await Kategorie.create({
            name: "Larp",
            beschreibung: "Life Action Roleplay"
        });
    } catch (e) {

    }
})(); */

//Server wird gestartet
(async () => {
    await sequelize.sync(/*{force: true}*/);

    createServer(app)
        .listen(3000, () => {
            console.log("My API is running...");
            sequelize
                .authenticate()
                .then(() => {
                    console.log('Connection has been established successfully.');
                })
                .catch(err => {
                    console.error('Unable to connect to the database:', err);
                });
        })
})();


