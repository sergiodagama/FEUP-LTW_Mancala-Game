import Express from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const app = Express();

const PORT = 4000

let users = [];

/**
 * Middleware
*/
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

    const userIndex = users.map(user => user.nick).indexOf(req.body.nick);

    if(userIndex == -1){
        res.status(400).send({"status": "You are not registered yet!"});
    }
    else{
        const user = users[userIndex];

        if(user.password == req.body.password){
            console.log("LOGIN INFO:");
            console.log(req.body);

            //create authorization token and send it
            const accessToken = jwt.sign(user, process.env.TOKEN_ACCESS_SECRET);

            let userInfo = {
                "email": user.email,
                "nick": user.nick,
                "birthday": user.birthday,
                "country": user.country,
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
    else if(users.map(user => user.nick).indexOf(req.body.nick) != -1){
        res.status(400).send({"status": "User is already registered!"});
    }
    else{
        console.log("REGISTER INFO:");
        console.log(req.body);
        users.push(req.body);
        res.status(200).send({"status": "User registered with success!"});
    }
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
