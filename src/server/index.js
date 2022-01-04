import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import http from 'http';
import nodemailer from 'nodemailer';

dotenv.config();

const PORT = 4000

let models = [];
let activeUsers = [];
let waitingRoom = [];

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
            console.log("MongoDB connected successfully!");
        }).catch((err) => {
            console.log("MongoDB connection failed: " + err);
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
 * Middleware
 */
//Authentication tokens validation
function validateToken(req, res) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token);

    if(token == null){
        send(res, 401, {"Content-Type": "application/json"}, {"status": "Access Denied!"});
        return false;
    }

    return jwt.verify(token, process.env.TOKEN_ACCESS_SECRET, (err) => {
        if(err){
            send(res, 403, {"Content-Type": "application/json"}, {"status": "Error: Access Denied!"});
            return false;
        }
        else{
            console.log("HERE");
            return true;
        }
    });
}

/**
 * Server
 */

function send(res, status, type, data){
    res.writeHead(status, type);
    res.write(JSON.stringify(data));
    res.end();
}

http.createServer((req, res) => {

    /**
     * Routes
     */
    const url = req.url;

    if(url === "/login"){
        console.log("\n===> Login Endpoint\n");

        req.on('data', data => {
            const jsonData = JSON.parse(data.toString());
            console.log('>> Request data: ', jsonData);

            models[0].findOne({nick: jsonData.nick}, (err, userFound) => {
                if (userFound == null || err){
                    send(res, 400, {"Content-Type": "application/json"}, {"status": "You are not registered yet!"});
                }
                else if(activeUsers.indexOf(jsonData.nick) != -1){
                    send(res, 400, {"Content-Type": "application/json"}, {"status": "You already have your account open!"});

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
                        send(res, 200, {"Content-Type": "application/json"}, userInfo);

                        //add user to active users
                        activeUsers.push(jsonData.nick);
                    }
                    else{
                        send(res, 400, {"Content-Type": "application/json"}, {"status": "Wrong password!"});
                    }
                }
            });
        });

        req.on('end', () => {
            console.log('>> Request End\n');
        });
    }
    else if(url === "/register"){
        console.log("\n===> Register Endpoint\n");

        req.on('data', data => {
            const jsonData = JSON.parse(data.toString());
            console.log('>> Request data: ', jsonData);

            if(Object.keys(jsonData).length < 5){
                send(res, 400, {"Content-Type": "application/json"}, {"status": "Missing information for registering!"});
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
                    send(res, 200, {"Content-Type": "application/json"}, userInfo);

                    //creating user in database
                    db.createUser(jsonData);

                    //add user to active users
                    activeUsers.push(jsonData.nick);
                }
                else{
                    console.log("Result : ", userFound);
                    send(res, 400, {"Content-Type": "application/json"}, {"status": "User is already registered!"});
                }
            });
        });

        req.on('end', () => {
            console.log('>> Request End\n');
        });
    }
    else if(url === "/logout"){
        if(validateToken(req, res)){
            console.log("\n===> Logout Endpoint\n");

            req.on('data', data => {
                const jsonData = JSON.parse(data.toString());
                console.log('>> Request data: ', jsonData);

                const userInWaitinRoom = findIndexByNick(waitingRoom, jsonData.nick);

                if(userInWaitinRoom != -1){
                    //leave waiting room if is there
                    waitingRoom.splice(userInWaitinRoom, 1);
                }


                const userActiveIndex = activeUsers.indexOf(jsonData.nick);

                if(userActiveIndex != -1){
                    //remove user from active users
                    activeUsers.splice(activeUsers.indexOf(jsonData.nick), 1);

                    send(res, 200, {"Content-Type": "application/json"}, {"status": "Logged out successfully!"});
                }
                else{
                    send(res, 400, {"Content-Type": "application/json"}, {"status": "You do not have your account open!"});
                }
            });
            req.on('end', () => {
                console.log('>> Request End\n');
            });
        }
    }
    else if(url === "/recover"){
        console.log("\n===> Recover Endpoint\n");

        req.on('data', data => {
            const jsonData = JSON.parse(data.toString());
            console.log('>> Request data: ', jsonData);

            models[0].findOne({email: jsonData.email}, (err, userFound) => {
                if (userFound == null || err){
                    send(res, 400, {"Content-Type": "application/json"}, {"status": "Email not registered!"})
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
                                send(res, 400, {"Content-Type": "application/json"}, {"status": "We were not able to sent you the email, please contact us"});
                            } else {
                                console.log('Email sent: ' + info.response);
                                send(res, 200, {"Content-Type": "application/json"}, {"status": "We sent you the recover information to your email"});
                            }
                    });
                }
            });
        });
        req.on('end', () => {
            console.log('>> Request End\n');
        });
    }
    else{

    }
})
.listen(PORT, () => {
    console.log("Server is Running in port " + PORT);
});