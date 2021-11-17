import express from 'express';
const app = express();
import { main } from "./index"

app.use(express.json());

const distDir = "iteratifBarker-front/dist/";
app.use(express.static(distDir));

// Init the server
const server = app.listen(process.env.PORT || 8080, function () {
    // @ts-ignore
    const port = server.address().port;
    console.log("App now running on port", port);
    main();
});

app.get("/api/status", function (req, res) {
    res.status(200).json({ status: "UP" });
});