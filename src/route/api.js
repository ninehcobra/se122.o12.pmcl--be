import express from "express"
import apiController from "../controller/apiController"
import { checkUserJWT, checkUserPermission } from "../middleware/JWTAction";


const router = express.Router()






const initWebRoutes = (app) => {
    router.all('*', checkUserJWT, checkUserPermission)
    router.get("/", (req, res) => {
        return res.send('api ne')
    })
    router.get("/account", apiController.handlegetUserAccount)


    // rest api
    // router.all("*", checkUserJWT, checkUserPermission,)

    router.post("/register", apiController.handleRegisterNewUser)
    router.post("/login", apiController.handleLogin)
    router.post("/logout", apiController.handleLogOut)
    router.post("/create-role", apiController.handleCreateRole)

    router.post("/create-grouprole", apiController.handleCreateGroupRole)

    router.get("/course", apiController.handlegetCourse)
    router.post("/create-course", apiController.handleCreateCourse)
    router.get("/course-by-ownerid", apiController.handleGetOwnerId)
    router.post("/update-course", apiController.handleUpdateCourse)
    router.post("/delete-course", apiController.handleDeleteCourse)

    router.post("/create-blog", apiController.handleCreateBlog)
    router.post("/create-comment", apiController.handleCreateComment)
    router.get("/get-blog", apiController.handleGetBlog)
    router.post("/delete-blog", apiController.handleDeleteBlog)
    router.post("/update-blog", apiController.handleUpdateBlog)
    router.post("/delete-comment", apiController.handleDeleteComment)

    router.post("/create-topic", apiController.handleCreateTopic)
    router.post("/delete-topic", apiController.handleDeleteTopic)
    router.get("/get-topic", apiController.handleGetTopic)

    router.post("/create-category", apiController.handleCreateCategory)
    router.get("/get-category", apiController.handleGetCategory)

    router.get("/test-api", apiController.testApi)

    return app.use("/api", router)
}

export default initWebRoutes