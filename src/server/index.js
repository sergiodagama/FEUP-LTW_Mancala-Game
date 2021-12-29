import Express from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = Express();
const PORT = 4000

/**
 * Database
 */

//class that encapsulates the database manipulations
class Database{
    constructor(){
        this.models = [];
    }

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

        const userModel = mongoose.model("usuario", userSchema);
        this.models.push(userModel);
    }

    loadSchemas(){
        this.createUserSchema();
    }

    createUser(user){
        const dbUser = mongoose.model("usuario");

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

    findUser(username){
        this.models[0].findOne({nick: username}).exec().then((doc) => {
            console.log("HER BRO ", doc);
            return doc;
        }).catch((err) =>{
            console.log("Error on DB function findUser()" + err);
        });
    }
}

const db = new Database();
db.start();
db.loadSchemas();

/**
 * Middleware
 */
//Authentication tokens validation
function validateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null){
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.TOKEN_ACCESS_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);

        req.user = user;
        next();
    })
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
//Login
app.post("/login", (req, res) => {
    console.log("Login Endpoint");

    const userFound = db.findUser(req.body.nick);

    console.log("USER FOUND: ", userFound);

    if(userFound == null){
        res.status(400).send({"status": "You are not registered yet!"});
    }
    else{
        if(userFound.password == req.body.password){
            console.log("LOGIN INFO:");
            console.log(req.body);

            //create authorization token and send it
            const accessToken = jwt.sign(userFound, process.env.TOKEN_ACCESS_SECRET);

            let userInfo = {
                "email": userFound.email,
                "nick": userFound.nick,
                "birthday": userFound.birthday,
                "country": userFound.country,
                "accessToken": accessToken
            }
            res.status(200).send(userInfo);
        }
        else{
            res.status(400).send({"status": "Wrong password!"});
        }
    }
})

//Register
app.post("/register", (req, res) => {
    console.log("Register Endpoint");

    if(Object.keys(req.body).length < 5){
        res.status(400).send({"status": "Missing information for registering!"});
    }
    else if(db.findUser(req.body.nick) != null){
        res.status(400).send({"status": "User is already registered!"});
    }
    else{
        console.log("REGISTER INFO:");
        console.log(req.body);

        //response back to client
        res.status(200).send(req.body);

        //creating user in database
        db.createUser(req.body);
    }
})

//Logout
app.post("/logout", (req, res) => {
    console.log("Logout Endpoint");

    res.send({"status": "Logged out successfully!"});
})

//Recover
app.post("/recover", (req, res) => {
    console.log("Recover Endpoint");

    if(users.map(user => user.email).indexOf(req.body.email) == -1){
        res.status(400).send({"status": "Email not registered!"});
    }
    else{
        console.log("RECOVER INFO:");
        console.log(req.body);
        res.send({"status": "We sent you all the recover information to your email"});
        //send recovery email
    }
})

app.listen(PORT, ()=>{
    console.log("Server is Running in port " + PORT);
})
