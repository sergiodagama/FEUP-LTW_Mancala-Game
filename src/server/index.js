import Express from "express";

const app = Express();

app.use(Express.json());  //to parse request body as json

const PORT = 4000

let users = [];

/**
 * Routes
 */

//Login
app.post("/login", (req, res) => {
    console.log("Login Endpoint");

    const userIndex = users.map(user => user.nick).indexOf(req.body.nick);

    if(userIndex == -1){
        res.status(404).send("You are not registered yet!");
    }
    else{
        const user = users[userIndex];

        if(user.password == req.body.password){
            console.log("LOGIN INFO:");
            console.log(req.body);

            let userInfo = {
                "email": user.email,
                "nick": user.nick,
                "birthday": user.birthday,
                "country": user.country
            }

            res.status(200).send(userInfo);

            //create authorization token and send it
        }
        else{
            res.status(400).send("Wrong password!");
        }
    }
})

//Register
app.post("/register", (req, res) => {
    console.log("Register Endpoint");

    if(Object.keys(req.body).length < 5){
        res.status(400).send("Missing information for registering!");
    }
    else if(users.map(user => user.nick).indexOf(req.body.nick) != -1){
        res.status(400).send("User is already registered!");
    }
    else{
        console.log("REGISTER INFO:");
        console.log(req.body);
        users.push(req.body);
        res.status(200).send("User registered with success!");
    }
})

//Recover
app.post("/recover", (req, res) => {
    console.log("Recover Endpoint");

    if(users.map(user => user.email).indexOf(req.body.email) == -1){
        res.status(404).send("Email not registered!");
    }
    else{
        console.log("RECOVER INFO:");
        console.log(req.body);
        res.send("We sent you all the recover information to your email");
        //send recovery email
    }
})

app.listen(PORT, ()=>{
    console.log("Server is Running in port " + PORT);
})