import express from "express";
import bodyParser from "body-parser";
import path from "path";
import url from "url";
import "dotenv/config";
import router from "./src/routes/router.js";

const app = express();
const port = process.env.PORT || 3000;
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//MiddleWares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use('/', router);


//Start the server
app.listen(port, ()=>{
    console.log(`Server Running on Port ${port}`);
});

