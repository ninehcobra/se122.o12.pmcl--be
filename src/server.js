import express from "express"
import configViewEngine from "./config/viewEngine"
import initWebRoutes from "./route/web"
import initApiRoutes from "./route/api"
import dotenv from "dotenv"
import bodyParser from "body-parser"

dotenv.config()

const app = express()

// fix CORS
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// config View engine
configViewEngine(app)

// config body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//init web routes
initWebRoutes(app)
initApiRoutes(app)

const PORT = process.env.PORT || 8888

app.listen(PORT, () => {
    console.log(`App is running on the port: http://localhost:${PORT}`)
})