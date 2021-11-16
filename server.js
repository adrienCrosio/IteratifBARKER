var express = require("express");
var app = express();

app.use(express.json());

var distDir = "iteratifBarker-front/dist/";
app.use(express.static(distDir));

// Init the server
var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});

app.get("/api/status", function (req, res) {
    res.status(200).json({ status: "UP" });
});