// --- Load Environment Variables ---
require('dotenv').config();

// --- Import Core Modules ---
const express = require("express")
const path = require("path")
const exphb = require("express-handlebars")
const session = require("express-session");

// --- App Setup ---
const app = express();

// --- Templating Engine ---
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '/src/views'));
const hbs = exphb.create({
    defaultLayout: "main",
    helpers: {
        eq: (a, b) => a === b,
        neq: (a, b) => a !== b
    }
})
app.engine("handlebars", hbs.engine)
app.set("view engine", "handlebars")

// --- Middleware ---
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// --- Routes ---
app.get("/", (req, res) => {
    res.render("index");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/signup", (req, res) => {
    res.render("signup");
});
app.use("/api", require("./src/routes/api.js"));

// --- Start the Server ---
app.listen(app.get("port"), () => {
    console.log(`Server running on http://localhost:${app.get('port')}`);
});
