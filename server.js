var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var dbMongo = require("./models");
// var dotenv = require('dotenv');
// var PORT = 3000;
var PORT = process.env.PORT || 3000;

var app = express();

// dotenv.config();


app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));



// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI  || "mongodb://localhost/newsArticles";
// mongoose.connect("mongodb://localhost/newsArticles", { useNewUrlParser: true });
// console.log(MONGODB_URI);
mongoose.connect(MONGODB_URI);

// var db = mongoose.connection;

// db.on("error", console.error.bind(console, "connection error:"));

// Routes

app.get("/scrape", function(req, res) {
  axios.get("https://news.ycombinator.com/").then(function(response) {
    var $ = cheerio.load(response.data);
    console.log($);
    // var header = $(this).find("body").text()
    // console.log(header)
    $("tbody tr td").each(function(i, element) {
      var result = {};

      result.title = $(this)
        .children("a.storylink")
        .text();
      result.link = $(this)
        .children("a.storylink")
        .attr("href");

      dbMongo.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          return res.json(err);
        });
    });

    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  dbMongo.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  dbMongo.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  dbMongo.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Clear the DB
app.get("/clearall", function(req, res) {
  dbMongo.Article.remove({}, function(error, response) {
    if (error) {
      console.log(error);
      res.send(error);
    }
    else {
      console.log(response);
      res.send(response);
    }
  });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

// app.listen(MONGODB_URI || PORT, function() {
//   console.log("App running on port" + "!");
// });
