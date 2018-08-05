import * as express from "express";
import * as bodyParser from "body-parser";
import {users} from "./routes/users";
import {createServer} from "http";
import {sequelize} from "./sequelize";

export const app = express();


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit: '5mb'}));

app.use('/users', users);

(async () => {
    await sequelize.sync({force: true});

    createServer(app)
        .listen(3000, () => {
            console.log("My API is running...");
        })
})();