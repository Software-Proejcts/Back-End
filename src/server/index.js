const express = require('express'); // module for express router
const http = require('http'); // module for http server
const { env, connected } = require('process');

const ObjectId = require('mongodb').ObjectID;

const passwordHash = require('password-hash');

const MongoDBHandler = require("./database.js");

const MongoDB = new MongoDBHandler(env.DBUSER, env.DBPASS, env.DBCLUSTER);

const app = express(); // init express router and assign it to variable app
app.use(express.json());

//const wwwRoot = "build/server/www"
//app.use(express.static("build/server/www")); // tell app to use index.html at build/www

// creates the server and sets it to use the express router we set up earlier 
const server = http.createServer(app);

app.post("/api/me", async function (req, res) {
    //console.log(req.body.id);
    const userdata = await MongoDB.Find('csc394', 'users', { "_id": ObjectId(req.body.id) });
    //console.log(userdata);
    res.send(userdata);
});

app.post("/api/login", async function (req, res) {
    // const data = req.body;
    // console.log(req.body.username);

    const userdata = await MongoDB.Find('csc394', 'users', { email: req.body.email });

    // Checks if user exists in DB.
    if (userdata !== null) {
        // checks user password with provided password
        if (passwordHash.verify(req.body.password, userdata.password)) {
            // res.redirect('/home');
            res.send(userdata._id);
        }
        // if passwords do not match throw error.
        else {
            res.status(401).end("Bad Password");
        }
    }
    // if username does not exist throw error
    else {
        res.status(401).end("Bad Username");
    }
});

app.post("/api/signup", async function (req, res) {
    const userdata = await MongoDB.Find('csc394', 'users', { email: req.body.email });
    if (userdata === null) {
        const data = {
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
            "email": req.body.email,
            "password": passwordHash.generate(req.body.password),
            "userType": 1
        };
        await MongoDB.Create('csc394', 'users', data)
        const newUser = await MongoDB.Find('csc394', 'users', { email: req.body.email });
        if (newUser !== null) {
            res.send(newUser._id);
        }
        else
            res.status(503).end("Unexpected Server Error");
    }
    else {
        res.status(401).end("Email is already taken");
    }
});

// Start the server.
server.listen(env.PORT || 8080, () => {
    if(env.NODE_ENV == "development")
        console.log('Listening at http://localhost:8080');
    
    async function connectMongo() {
        // connects MongoDB
        await MongoDB.connect();
        // await MongoDB.listDatabases();
        // How to do a basic query.
        // console.log(await MongoDB.Find('csc394', 'users', { firstName: 'Dean' }));
    }
    connectMongo();
    
});