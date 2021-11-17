import express from 'express';
import { main } from "./index";
const app = express();

app.use(express.json());

// Create link to Angular build directory
// The `ng build` command will save the result
// under the `dist` folder.
// const distDir = "iteratifBarker-front/dist/";
// app.use(express.static(distDir));
/*** BUT DOES NOT CHANGE ANYTHING FOR ME AT THAT MOMENT I DONT UNDERSTAND THIS LINE ***/

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