import express from "express";
import bodyParser from "body-parser";
import path from "path";
import url from "url";
import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import router from "./src/routes/router.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {},
});

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//MiddleWares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs"),
app.use(express.static(path.join(__dirname, "public")));

app.use("/", router);


//socket
let clients = {};

io.on("connection", function(socket) {
    let id = socket.id;

    console.log("New client connected. ID: ", socket.id);
    clients[socket.id] = socket;

    socket.on("disconnect", () => {// Bind event for that socket (player)
        console.log("Client disconnected. ID: ", socket.id);
        delete clients[socket.id];
        socket.broadcast.emit("clientdisconnect", id);
    });

});



export default server;
