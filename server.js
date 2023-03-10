const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
app.use(fileUpload());
let http = require('http');
http = require("http").createServer(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
const dotenv = require('dotenv');
dotenv.config();
// const cors = require('cors');
// app.use(cors());
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const ApiRouter = require('./routes/ApiRouter'); 
app.use('/',ApiRouter);
mongoose.connect(process.env.DB_URL,{dbName:process.env.DB_NAME,useNewUrlParser:true,useUnifiedTopology:true}); 
const server = http.listen(process.env.HOST_PORT,()=>console.log(`${process.env.APP_URL}:${process.env.HOST_PORT}`)); 
