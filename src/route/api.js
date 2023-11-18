import express from "express"
import apiController from "../controller/apiController"
import { checkUserJWT, checkUserPermission } from "../middleware/JWTAction";


const router = express.Router()






const initWebRoutes = (app) => {
    router.all('*', checkUserJWT, checkUserPermission)
    router.get("/", (req, res) => {
        console.log(req.user)
        return res.send('api ne')
    })
    router.get("/account", apiController.handlegetUserAccount)


    // rest api
    // router.all("*", checkUserJWT, checkUserPermission,)

    router.post("/register", apiController.handleRegisterNewUser)
    router.post("/login", apiController.handleLogin)
    router.post("/create-role", apiController.handleCreateRole)

    router.post("/create-grouprole", apiController.handleCreateGroupRole)

    router.get("/course", apiController.handlegetCourse)
    router.post("/create-course", apiController.handleCreateCourse)
    router.get("/course-by-ownerid", apiController.handleGetOwnerId)


    router.get("/api/test-api", apiController.testApi)

    return app.use("/api", router)
}

export default initWebRoutes