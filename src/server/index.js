const express = require('express'); // module for express router
const http = require('http'); // module for http server

const app = express(); // init express router and assign it to variable app

const wwwRoot = "build/server/www"
app.use(express.static("build/server/www")); // tell app to use index.html at build/www

// creates the server and sets it to use the express router we set up earlier 
const server = http.createServer(app);

// define the first route
app.get("/", function (req, res) {
    res.sendFile("index.js")
})


// Start the server.
console.log('Listening at http://localhost:80');
server.listen(80);