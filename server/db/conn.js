require("dotenv").config();
const mongoose=require("mongoose");
const express=require("express");
const app =express();
const url=process.env.URL
const connString="mongodb+srv://f20202130:<password>@cluster0.qttzk5b.mongodb.net/"
const port= 8005;

mongoose.connect(url,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>console.log(`Connection start on port ${port}`)).catch((e)=> console.log(e.message)); 