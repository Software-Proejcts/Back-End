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

// DONE
app.post("/api/me", async function (req, res) {
    //console.log(req.body.id);
    const userdata = await MongoDB.Find('csc394', 'users', { "_id": ObjectId(req.body.id) });
    //console.log(userdata);
    res.send(userdata);
});

// DONE
app.post("/api/newteam", async function (req, res) {
    const userdata = await MongoDB.Find('csc394', 'users', { "_id": ObjectId(req.body.id) });
    if (userdata !== null) {
        const data = {
            "name": req.body.name,
            "members": [ObjectId(req.body.id)],
            "tasks": []
        };
        await MongoDB.Create('csc394', 'teams', data);
        const uid = data._id;
        // console.log(uid);
        const newTeam = await MongoDB.Find('csc394', 'teams', { "_id": uid });
        if (newTeam !== null) {
            // updates users team
            await MongoDB.UpdateOne('csc394', 'users', { "_id": ObjectId(req.body.id) }, { $set: { "team": ObjectId(uid) } });
            res.status(200).end("Created team!");
        }
        else {
            res.status(503).end("Unexpected Server Error");
        }
    }
    res.status(401).end();
});

// DONE
app.post("/api/team", async function (req, res) {
    const teamdata = await MongoDB.Find('csc394', 'teams', { "_id": ObjectId(req.body.teamID) });
    res.send(teamdata);
});

// DONE
app.post("/api/team/gettasks", async function (req, res) {
    const teamdata = await MongoDB.Find('csc394', 'teams', { "_id": ObjectId(req.body.teamID) });
    res.send(teamdata.tasks);
});

// DONE
app.post("/api/team/newtask", async function (req, res) {
    const userdata = await MongoDB.Find('csc394', 'users', { "_id": ObjectId(req.body.id) });
    if (userdata !== null) {
        const data = {
            "name": req.body.name,
            "owner": ObjectId(req.body.id),
            "due": req.body.date
        };

        // appends task to task list
        await MongoDB.UpdateOne('csc394', 'teams', { "_id": ObjectId(userdata.team) }, { $push: { "tasks": data } });
        res.send(data);
    }
    else {
        res.status(401).end("user not authorized");
    }
});

// DONE
app.post("/api/team/join", async function (req, res) {
    const userdata = await MongoDB.Find('csc394', 'users', { "_id": ObjectId(req.body.id) });
    if (userdata !== null) {
        const team = await MongoDB.Find('csc394', 'teams', { "name": req.body.team });
        if (team !== null) {

            // updates users team
            await MongoDB.UpdateOne('csc394', 'users', { "_id": ObjectId(req.body.id) }, { $set: { "team": ObjectId(team._id) } });

            // updates team member list
            await MongoDB.UpdateOne('csc394', 'teams', { "_id": ObjectId(team._id) }, { $push: { "members": ObjectId(team._id) } });

            res.status(200).end("joined team");
        }
        else {
            res.status(503).end("Could not find team");
        }
    }
    else {
        res.status(401).end("User not authorized");
    }
});

// DONE
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

// DONE
app.post("/api/signup", async function (req, res) {
    const userdata = await MongoDB.Find('csc394', 'users', { email: req.body.email });
    if (userdata === null) {
        const data = {
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
            "email": req.body.email,
            "password": passwordHash.generate(req.body.password),
            "school": req.body.school,
            "team": null,
            "userType": 1
        };
        const uid = await MongoDB.Create('csc394', 'users', data)
        const newUser = await MongoDB.Find('csc394', 'users', { "_id": uid });
        if (newUser !== null) {
            res.send(newUser._id);
        }
        else {
            res.status(503).end("Unexpected Server Error");
        }
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