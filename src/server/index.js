import Express from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = Express();
const PORT = 4000

let models = [];

let waitingRoom = [];

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
const validateToken = () => { return (req, res, next) =>
    {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if(token == null){
            return res.status(401).send("Access Denied");
        }

        jwt.verify(token, process.env.TOKEN_ACCESS_SECRET, (err, user) => {
            if(err) return res.status(403).send("Error: Access Denied");

            req.user = user;
            next();
        })
    }
}

//CORS prevention
let allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', "*");
    next();
}

app.use(allowCrossDomain);
app.use(Express.json());  //to parse request body as json

/**
 * Routes
 */
//---------------Authentication---------------
//Login
app.post("/login", (req, res) => {
    console.log("Login Endpoint");

    models[0].findOne({nick: req.body.nick}, (err, userFound) => {
        if (userFound == null || err){
            //console.log("User not found" + err);
            res.status(400).send({"status": "You are not registered yet!"});
        }
        else{
            console.log("Found user ", userFound);

            if(userFound.password == req.body.password){
                console.log("LOGIN INFO:");
                console.log(req.body);

                //create authorization token and send it
                const accessToken = jwt.sign(req.body, process.env.TOKEN_ACCESS_SECRET);

                let userInfo = {
                    "email": userFound.email,
                    "nick": userFound.nick,
                    "birthday": userFound.birthday,
                    "country": userFound.country,
                    "accessToken": accessToken
                }
                res.status(200).send(userInfo);
            }
            else res.status(400).send({"status": "Wrong password!"});
        }
    });
})

//Register
app.post("/register", (req, res) => {
    console.log("Register Endpoint");

    if(Object.keys(req.body).length < 5){
        res.status(400).send({"status": "Missing information for registering!"});
    }

    models[0].findOne({nick: req.body.nick}, (err, userFound) => {
        if (userFound == null || err || userFound == []){
            console.log("User not found " + err);

            console.log("REGISTER INFO:");
            console.log(req.body);

            //response back to client
            res.status(200).send(req.body);

            //creating user in database
            db.createUser(req.body);
        }
        else{
            console.log("Result : ", userFound);
            res.status(400).send({"status": "User is already registered!"});
        }
    });

})

//Logout
app.post("/logout", (req, res) => {
    console.log("Logout Endpoint");

    res.send({"status": "Logged out successfully!"});
})

//Recover
app.post("/recover", (req, res) => {
    console.log("Recover Endpoint");

    models[0].findOne({nick: req.body.nick}, (err, userFound) => {
        if (userFound == null || err){
            res.status(400).send({"status": "Email not registered!"});
        }
        else{
            console.log("RECOVER INFO:");
            console.log(req.body);
            res.send({"status": "We sent you all the recover information to your email"});
            //send recovery email
        }
    });
})

function findIndexByNick(array, username){
    return array.map(user => user.nick).indexOf(username);
}

//---------------Game---------------
//Joinning game waiting room
app.post("/join", validateToken(), (req, res) => {
    console.log("Join waiting room Endpoint");

    if(findIndexByNick(waitingRoom, req.body.nick) == -1){
        waitingRoom.push(req.body);
        res.status(200).send({"status": "You are in the waiting room"});
    }
    else{
        res.status(400).send({"status": "You already are in the waiting room"});
    }
})

//Leaving game waiting room
app.post("/leave", (req, res) => {
    console.log("Leave waiting room Endpoint");

    const userIndex = findIndexByNick(waitingRoom, req.body.nick);

    if(userIndex == -1){
        waitingRoom.splice(userIndex, 1);
        res.status(200).send({"status": "You were removed from the waiting room"});
    }
    else{
        res.status(400).send({"status": "You already aren't in the waiting room"});
    }
})

/*
//Invite to game session
app.post("/join/:invitedUserId", (req, res) => {
    console.log("Join game session Endpoint");
    console.log("ID: " + req.params);
    res.send(req.params);
})

//Leaving game session
app.post("/leave/:sessionId", (req, res) => {
    console.log("Leave game session Endpoint");
})
*/

app.listen(PORT, ()=>{
    console.log("Server is Running in port " + PORT);
})
