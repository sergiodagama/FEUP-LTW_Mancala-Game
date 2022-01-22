import http from 'http';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const PORT = 4000

let models = [];
let activeUsers = new Map();  //has the current active users with respective (res connection)

/**
 * Database
 */
//class that encapsulates the database manipulations
class Database{
    constructor(){}

    start(){
        //connect to mongoDB
        mongoose.connect("mongodb://localhost/mancalaOfficial").then(() => {
            console.log("db >> MongoDB connected successfully!");
        }).catch((err) => {
            console.log("db >> MongoDB connection failed: " + err);
        })
    }

    createUserSchema(){
        const userSchema = mongoose.Schema({
            nick: {
                type: String,
                require: true
            },
            password: {
                type: String,
                require: true
            },
            victories: {
                type: Number,
            },
            games : {
                type: Number,
            }
        })

        const userModel = mongoose.model("Users", userSchema);
        models.push(userModel);
    }

    loadSchemas(){
        this.createUserSchema();
    }

    createUser(user){
        const dbUser = mongoose.model("Users");

        new dbUser({
            nick: user.nick,
            password: user.password,
            victories: 0,
            games: 0
        }).save().then(() => {
            console.log("Create new user successfully in DB");
        }).catch((err) => {
            console.log("Error when creating user in DB: " + err);
        })
    }
}

const db = new Database();
db.start();
db.loadSchemas();

/**
 * Send response util
 */
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Max-Age': 2592000, // 30 days
    'Content-Type': 'application/json',
};

function send(res, status, data){
    res.writeHead(status, headers);
    res.write(JSON.stringify(data));
    res.end();
}

/**
 * Server
 */
const server = http.createServer((req, res) => {
    /**
     * Preflight Request
     */
    if (req.method === 'OPTIONS') {
        console.log("server >> Preflight request");
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Max-Age': 2592000, // 30 days
        });
        res.end();
        return;
    }

    /**
     * Routes
     */
    const endpoint = req.url;

    //Register Endpoint
    if(endpoint === "/register"){
        console.log("\n===> Register Endpoint\n");

        req.on('error', (err) => {
            console.error(err);
        })
        .on('data', (data) => {
            const jsonData = JSON.parse(data.toString());
            console.log('server >> Request data: ', jsonData);

            models[0].findOne({nick: jsonData.nick}, (err, userFound) => {
                if (userFound == null || err){

                    send(res, 200, {});

                    //creating user in database
                    db.createUser(jsonData);

                    //add user to active users map
                    activeUsers.set(jsonData.nick, res);
                }
                else{
                    console.log("Found user ", userFound);

                    if(userFound.password == jsonData.password){

                        send(res, 200, {});

                        //add user to active users map
                        activeUsers.set(jsonData.nick, res);
                    }
                    else{
                        send(res, 400, {"error": "User registered with a different password"});
                    }
                }
            });
        })
        .on('end', () => {
            console.log('server >> Request End\n');
        });
    }
    //Ranking endpoint
    else if(endpoint === "/ranking"){
        console.log("\n===> Ranking Endpoint\n");

        const rank = models[0].find({}).sort('victories').limit(10).then(data => {
            send(res, 200, {ranking: data});
        });

        req.on('end', () => {
            console.log('server >> Request End\n');
        });
    }
    //Wrong endpoint
    else{
        console.log("\n===> Not Found Endpoint\n");
        send(res, 404, {"status": "Requested endpoint Not Found"});
    }
})

server.listen(PORT, () => {
    console.log("server >> Started in port " + PORT + " successfully!");
});
