import server from "./app.js";
import "dotenv/config";

const port = process.env.PORT || 3000;

//Start the server
server.listen(port, ()=>{
    console.log(`Server Running on Port ${port}`);
});