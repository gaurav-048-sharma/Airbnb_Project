if(process.env.NODE_ENV != "production") {
    require('dotenv').config()
}

// console.log(process.env.SECRET)

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user.js");


const dbUrl = process.env.ATLASDB_URL;

app.set("views",path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
      },
      touchAfter: 24 * 60 * 60,
});

store.on('error', (err) => {
    console.log('session store error',);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false, 
    saveUninitialized:true,
    cookie: {
        expires: Date.now().toString() + 7 * 24 *60*60 *1000,
        maxAge: 7 * 24 *60*60 *1000,
        httpOnly: true,
    },
};

// app.get("/" ,(req, res) => {
//     res.send("hello");
// });

app.use(session(sessionOptions));
app.use(flash());

// app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); //User Information is serialized, once loged in
passport.deserializeUser(User.deserializeUser()); //User Information, once remove is uniserialized 

main().then(() => {
    console.log("connected successfully")
}).catch((err) => {
    console.log(err.message);
})

async function main() {
    await mongoose.connect(dbUrl);
  }


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    // console.log(res.locals.success);
    next();
})

// app.get("/demouser", async(req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student",

//     })
//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });







app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);







app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let {statusCode=500 , message="something went wrong"} = err;
    res.status(statusCode).render("error.ejs", {err});
    // res.status(statusCode).send(message);
    // res.send("something went wrong")
})

app.listen(port, (req, res) => {
    console.log(`Server is running on port ${port}`);
})