require("dotenv").config();
const express =require("express");
const app = express();
const mongoose=require("mongoose");
const port =8005;

require("./db/conn");
const cookieParser = require('cookie-parser');

const Product=require("./models/productSchema");
const DefaultData = require("./defaultdata");
const cors = require('cors');
const router =require("./routes/router");


app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(router);

app.listen(port,()=>{
    console.log(`server is running on port number ${port}`);
});
DefaultData();