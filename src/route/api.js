import express from "express"
import apiController from "../controller/apiController"
import { checkUserJWT } from "../middleware/JWTAction";

const router = express.Router()


const checkUserLogin = (req, res, next) => {
    const nonSecurePaths = ['/', '/register', '/login']
    if (nonSecurePaths.includes(req.path)) return next();


    // authentication
    if (user) {
        next()
    } else {

    }
}



const initWebRoutes = (app) => {
    router.get("/", checkUserJWT, (req, res) => {
        console.log(req.user)
        return res.send('api ne')
    })


    // rest api

    router.post("/register", apiController.handleRegisterNewUser)
    router.post("/login", apiController.handleLogin)


    router.get("/api/test-api", apiController.testApi)

    return app.use("/api", router)
}

export default initWebRoutes