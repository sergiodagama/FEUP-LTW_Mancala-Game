import http from 'http';
import url from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';

dotenv.config();

const PORT = 4000

let models = [];
let activeUsers = new Map();  //has the current active users
let waitingRoom = [];  //controls the waitingRoom, when user is waiting for other to play

let activeGames = []; //contains 1 if one user as enter the game (of gameId correspondat to the array index), contain 2 if both users has entered

function findIndexByNick(array, username){
    return array.map(user => user.nick).indexOf(username);
}

/**
 * Nodemailer
 */
 const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    //secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Database
 */

//class that encapsulates the database manipulations
class Database{
    constructor(){}

    start(){
        //connect to mongoDB
        mongoose.connect("mongodb://localhost/mancala").then(() => {
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
            email: {
                type: String,
                require: true
            },
            birthday: {
                type: String,
                require: true
            },
            country: {
                type: String,
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
            email: user.email,
            birthday: user.birthday,
            country: user.country
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

function sendEvent(res, data){
    res.setHeader('Content-Type', 'text/event-stream');
    res.write(data);
}

/**
 * Middleware
 */
//Authentication tokens validation
function validateToken(req, res) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null){
        send(res, 401, {"status": "Access Denied!"});
        return false;
    }

    return jwt.verify(token, process.env.TOKEN_ACCESS_SECRET, (err) => {
        if(err){
            send(res, 403, {"status": "Error: Access Denied!"});
            return false;
        }
        else{
            return true;
        }
    });
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

    //Login Endpoint
    if(endpoint === "/login"){
        console.log("\n===> Login Endpoint\n");

        req.on('error', (err) => {
            console.error(err);
        })
        .on('data', (data) => {
            const jsonData = JSON.parse(data.toString());
            console.log('server >> Request data: ', jsonData);

            models[0].findOne({nick: jsonData.nick}, (err, userFound) => {
                if (userFound == null || err){
                    send(res, 400, {"status": "You are not registered yet!"});
                }
                else if(activeUsers.get(jsonData.nick) != undefined){
                    send(res, 400, {"status": "You already have your account open!"});

                }
                else{
                    console.log("Found user ", userFound);

                    if(userFound.password == jsonData.password){
                        //create authorization token and send it
                        const accessToken = jwt.sign(jsonData, process.env.TOKEN_ACCESS_SECRET);

                        let userInfo = {
                            "email": userFound.email,
                            "nick": userFound.nick,
                            "birthday": userFound.birthday,
                            "country": userFound.country,
                            "accessToken": accessToken
                        }
                        send(res, 200, userInfo);

                        //add user to active users map
                        activeUsers.set(jsonData.nick, res);
                    }
                    else{
                        send(res, 400, {"status": "Wrong password!"});
                    }
                }
            });
        })
        .on('end', () => {
            console.log('server >> Request End\n');
        });
    }
    //Register Endpoint
    else if(endpoint === "/register"){
        console.log("\n===> Register Endpoint\n");

        req.on('data', data => {
            const jsonData = JSON.parse(data.toString());
            console.log('server >> Request data: ', jsonData);

            if(Object.keys(jsonData).length < 5){
                send(res, 400, {"status": "Missing information for registering!"});
            }

            models[0].findOne({nick: jsonData.nick}, (err, userFound) => {
                if (userFound == null || err || userFound == []){
                    console.log("User not found " + err);

                    //create authorization token and send it
                    const accessToken = jwt.sign(jsonData, process.env.TOKEN_ACCESS_SECRET);

                    let userInfo = {
                        "email": jsonData.email,
                        "nick": jsonData.nick,
                        "birthday": jsonData.birthday,
                        "country": jsonData.country,
                        "accessToken": accessToken
                    }
                    send(res, 200, userInfo);

                    //creating user in database
                    db.createUser(jsonData);

                    //add user to active users map
                    activeUsers.set(jsonData.nick, res);
                }
                else{
                    console.log("Result : ", userFound);
                    send(res, 400, {"status": "User is already registered!"});
                }
            });
        });

        req.on('end', () => {
            console.log('server >> Request End\n');
        });
    }
    //Logout Endpoint
    else if(endpoint === "/logout"){
        if(validateToken(req, res)){
            console.log("\n===> Logout Endpoint\n");

            req.on('data', data => {
                const jsonData = JSON.parse(data.toString());
                console.log('server >> Request data: ', jsonData);

                const userInWaitinRoom = findIndexByNick(waitingRoom, jsonData.nick);

                if(userInWaitinRoom != -1){
                    //leave waiting room if is there
                    waitingRoom.splice(userInWaitinRoom, 1);
                }

                const userActive = activeUsers.get(jsonData.nick);

                if(userActive != undefined){

                    //remove user from active users map
                    activeUsers.delete(jsonData.nick);

                    send(res, 200, {"status": "Logged out successfully!"});
                }
                else{
                    send(res, 400, {"status": "You do not have your account open!"});
                }
            });
            req.on('end', () => {
                console.log('server >> Request End\n');
            });
        }
    }
    //Recover Endpoint
    else if(endpoint === "/recover"){
        console.log("\n===> Recover Endpoint\n");

        req.on('data', data => {
            const jsonData = JSON.parse(data.toString());
            console.log('server >> Request data: ', jsonData);

            models[0].findOne({email: jsonData.email}, (err, userFound) => {
                if (userFound == null || err){
                    send(res, 400, {"status": "Email not registered!"})
                }
                else{
                    //send recovery email
                    transporter.sendMail(
                        {
                            from: 'mancalaserver@gmail.com',
                            to: userFound.email,
                            subject: 'Recover your Mancala Account',
                            text: "Recovery information\n" + "Username: " + userFound.nick + "\nPassword: " + userFound.password
                        },
                        function(error, info){
                            if (error) {
                                console.log(error);
                                send(res, 400, {"status": "We were not able to sent you the email, please contact us"});
                            } else {
                                console.log('Email sent: ' + info.response);
                                send(res, 200, {"status": "We sent you the recover information to your email"});
                            }
                    });
                }
            });
        });
        req.on('end', () => {
            console.log('server >> Request End\n');
        });
    }
    //Join Endpoint
    else if(endpoint.substring(0, 5) === "/join"){
        if(validateToken(req, res)){
            console.log("\n===> Join Endpoint\n");

            const params = url.parse(endpoint, true).query;

            console.log("PARAMS: ", params.invitedUser);

            req.on('data', data => {
                const jsonData = JSON.parse(data.toString());
                console.log('server >> Request data: ', jsonData);

                if(Object.keys(params).length === 0){
                    if(findIndexByNick(waitingRoom, jsonData.nick) == -1){
                        waitingRoom.push(jsonData);
                        send(res, 200, {"status": "You are in the waiting room",
                                        "gameId": gameId});

                        addToGame(jsonData.nick, gameId);

                        activeGames.set(jsonData.nick, gameId);

                        if(waitingRoom.length == 2){
                            waitingRoom = [];
                            gameId++;
                        }
                        activeGames[gameId] = 0;
                    }
                    else{
                        send(res, 400, {"status": "You already are in the waiting room"});
                    }
                }
                else{
                    if(findIndexByNick(waitingRoom, params.invitedUser) == -1){
                        send(res, 400, {"status": "That user is not online"});
                    }
                    else{
                        send(res, 200, {"status": "Invite sent, please wait"});
                        //FIXME
                    }
                }
            });
            req.on('end', () => {
                console.log('server >> Request End\n');
            });
        }
    }
    //Update endpoint
    else if(endpoint.substring(0, 7) === "/update"){ //FIXME

        const params = url.parse(endpoint, true).query;

        console.log("gameId: ", params.gameId);

        req.on('data', data => {
            const jsonData = JSON.parse(data.toString());
            console.log('server >> Request data: ', jsonData);

            if(activeGames[params.gameId] == 0){
                activeGames[params.gameId]++;
            }
            else if(activeGames[params.gameId] == 1){
                activeGames[params.gameId]++;
                sendEvent(activeUsers.get(jsonData.nick), {"status": "start"});
                sendEvent(activeUsers.get(getTheOtherUserByGameId(jsonData.nick, params.gameId)), {"status": "start"});
            }
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
