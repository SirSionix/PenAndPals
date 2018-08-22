import * as express from "express";
import {Request, Response} from "express";
import * as bodyParser from "body-parser";
import {users} from "./routes/users";
import {createServer} from "http";
import {sequelize} from "./sequelize";
import {events} from "./routes/events";
import {kategorien} from "./routes/kategorien";
import {systeme} from "./routes/systeme";
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

//Server wird gestartet
(async () => {
    await sequelize.sync(/*{force: true}*/);

    let port = 3000;

    createServer(app)
        .listen(port, () => {
            console.log("Server is running on port " + port + " ...");
            console.log("   http://localhost:" + port);
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
