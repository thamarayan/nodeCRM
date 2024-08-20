var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require('express-session');

var mongoStore = require('connect-mongo');

var indexRouter = require("./routes/index");

var app = express();

const mongoUrl = "mongodb+srv://ragav:ragavSvks@cluster-products-api.nar65.mongodb.net/";

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret:"mySecretKey",
  saveUninitialized:true,
  cookie:{maxAge: 1000 * 60 * 60 * 24},
  store: mongoStore.create({ mongoUrl : mongoUrl }),
  resave:false
}));

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));

app.use(function(req,res,next){
  res.locals.session = req.session;
  next();
})

app.use("/", indexRouter);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
