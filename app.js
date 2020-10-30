//importing dependencies
const path = require ("path");
const express = require ("express");
const bodyParser = require ("body-parser");
const mongoose = require ("mongoose");
const multer = require ("multer");

//initializing express server
const app = express();


app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));


//configuration for REST API 
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


//Error Handling
app.use((error, req, res, next) => {
    //console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
  });



                    //=======================//
//==================// MULTER CONFIGURATION  //============================//
                    //=======================//

var storage=multer.diskStorage({
    filename: function(req, file, callback){
        callback(null, Date.now() + file.originalname);
    }
});

var imageFilter = function (req,file,cb){
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)){
      return cb(new Error('Only image files are allowed!'),false);
  }  
  cb(null,true);
};

app.use(multer({storage:storage, fileFilter:imageFilter}).single('picture'));


                    //=======================//
//==================//         END           //============================//
                    //=======================//



                    //=======================//
//==================// ROUTES CONFIGURATION  //============================//
                    //=======================//

const articleRoutes = require("./routes/ArticlesDirectory/article");
app.use(articleRoutes);

const articleTopicRoutes = require("./routes/ArticlesDirectory/article-topic");
app.use(articleTopicRoutes);

const authenticationRoutes = require("./routes/User/is-auth");
app.use(authenticationRoutes);

const commentRoutes = require("./routes/ArticlesDirectory/Comment/comment");
app.use(commentRoutes);

const replyRoutes = require("./routes/ArticlesDirectory/Comment/reply");
app.use(replyRoutes);

                    //=======================//
//==================//         END           //============================//
                    //=======================//


                
const MONGODB_URI = "mongodb://Muzamil:password123@ds137957.mlab.com:37957/bemyhand";

mongoose
    .connect(MONGODB_URI)
    .then(result => {
        app.listen(8000);
        console.log("connected to the sever");
    })
    .catch (error => {
        console.log(error);
    });

