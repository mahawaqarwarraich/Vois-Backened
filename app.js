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

const userRoutes = require("./routes/User/user");
app.use(userRoutes);

const textEditorRoutes = require("./routes/TextEditor/text_editor");
app.use(textEditorRoutes);

const CVBuilderRoutes = require("./routes/CVBuilder/cv-builder");
app.use(CVBuilderRoutes);

const PortfolioRoutes = require("./routes/PortfolioBuilder/portfolio-builder");
app.use(PortfolioRoutes);

                    //=======================//
//==================//         END           //============================//
                    //=======================//



// const MONGODB_URI = "mongodb://Muzamil:password123@ds137957.mlab.com:37957/bemyhand";
const MONGODB_URI = "mongodb://admin:rKp0gAoByvmdNcAr@cluster0-shard-00-00.1ddwl.mongodb.net:27017,cluster0-shard-00-01.1ddwl.mongodb.net:27017,cluster0-shard-00-02.1ddwl.mongodb.net:27017/BeMyHand?ssl=true&replicaSet=atlas-a0vxl9-shard-0&authSource=admin&retryWrites=true&w=majority";
mongoose
    .connect(MONGODB_URI)
    .then(result => {
        app.listen(8000);
        console.log("connected to the sever");
    })
    .catch (error => {
        console.log(error);
    });

