const express = require("express");
const path = require("path");
const Handlebars = require("handlebars");
const exphbs = require("express-handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const passport=require('passport');

const morgan = require("morgan");

//inilializacion
const app = express(); //se ejecuta por ser una funcion
require('./config/passport');

//settings
app.set("port", process.env.PORT || 4000);
app.set("views", path.join(__dirname, "views")); //por defecto views debe estar en la raiz por eso se le dice a aexprres donde se ubica ahora para not ener problemas de rendizado
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);

app.set("view engine", ".hbs");

//middlewares  funciones q van procesar algo
app.use(express.urlencoded({ extended: false })); //para q soporte datos en formato json, sea capaz de entender datos del html
app.use(morgan("dev"));
app.use(methodOverride("_method"));
app.use(session({ secret: "secret", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Global variables

app.use((req,res,next)=>{

res.locals.success_msg= req.flash('success_msg');
res.locals.error_msg= req.flash('error_msg');
res.locals.error = req.flash('error');
res.locals.user=req.user||null;
    next();

});

//routes

app.use(require("./routers/index.routes"));
app.use(require("./routers/notes.routes"));
app.use(require("./routers/users.routes"));

//static files
app.use(express.static(path.join(__dirname, "public")));
//module exporta para se usando como una libreria
module.exports = app;
