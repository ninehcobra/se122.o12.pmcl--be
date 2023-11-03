import express from "express"
import apiController from "../controller/apiController"

const router = express.Router()



const initWebRoutes = (app) => {
    router.get("/", (req, res) => {
        return res.send('api ne')
    })


    // rest api
    router.get("/api/test-api", apiController.testApi)

    router.post("/register", apiController.handleRegisterNewUser)
    router.post("/login", apiController.handleLogin)

    return app.use("/api", router)
}

export default initWebRoutes