const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const dbConnect  = require("./config/dbConnect");
const { notFound, HandlerError } = require("./middlewares/errorHandler");
const bodyParser = require("body-parser");
const userRotuer = require("./routes/userRoute");

const PORT = process.env.PORT || 5000;
dbConnect();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get("/",(req,res)=>{
    res.send("server word")
});
app.use("/api/user",userRotuer);
app.use(express.urlencoded({extended:false}));






app.use(notFound);
app.use(HandlerError);
app.listen(PORT,()=>{
    console.log(`server word on http://localhost:${PORT}`);
});