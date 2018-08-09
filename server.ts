import * as express from "express";
import * as bodyParser from "body-parser";
import {users} from "./routes/users";
import {createServer} from "http";
import {sequelize} from "./sequelize";
import {events} from "./routes/events";
import {kategorien} from "./routes/kategorien";
import {systeme} from "./routes/systeme";

export const app = express();


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit: '5mb'}));

app.use('/users', users);
app.use('/events', events);
app.use('/kategorien',kategorien);
app.use('/systeme', systeme);

//Server wird gestartet
(async () => {
    await sequelize.sync({force: true});

    createServer(app)
        .listen(3000, () => {
            console.log("My API is running...");
        })
})();