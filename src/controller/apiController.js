import authenticationService from "../service/authenticationService"
import courseService from "../service/courseService"
import JWTService from "../service/JWTService"
import blogService from "../service/blogService"


const testApi = (req, res) => {
    return res.status(200).json({
        message: 'ok',
        data: 'test api'
    })
}

const handleRegisterNewUser = async (req, res) => {

    let data = await authenticationService.registerNewUser(req.body)

    return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: '',
    })
}

const handleLogin = async (req, res) => {
    let data = await authenticationService.login(req.body)
    if (data && data.DT && data.DT.access_token) {
        res.cookie("jwt", data.DT, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
    }


    return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
    })
}

const handleLogOut = async (req, res) => {
    res.cookie("jwt", req.cookie, { expires: new Date(Date.now()) })
    return res.status(200).json({
        EM: "Log out success",
        EC: 0
    })
}

const handlegetUserAccount = async (req, res) => {
    return res.status(200).json({
        EC: 0,
        EM: 'success',
        DT: req.user
    })
}

const handlegetCourse = async (req, res) => {

    let data = await courseService.getCourse(req.query.id)
    return res.status(200).json({
        EC: data.EC,
        EM: data.EM,
        DT: data.DT
    })
}

const handleCreateRole = async (req, res) => {
    let data = await JWTService.createRole(req.body)
    return res.status(200).json({
        EC: data.EC,
        EM: data.EM,
        DT: data.DT
    })
}

const handleCreateGroupRole = async (req, res) => {
    let data = await JWTService.createGroupRole(req.body)
    return res.status(200).json({
        EC: data.EC,
        EM: data.EM,
        DT: data.DT
    })
}

const handleCreateCourse = async (req, res) => {
    req.body.user = req.user
    let data = await courseService.createCourse(req.body)
    return res.status(200).json({
        EC: data.EC,
        EM: data.EM,
        DT: data.DT
    })
}

const handleUpdateCourse = async (req, res) => {
    req.body.user = req.user
    let data = await courseService.updateCourse(req.body)
    return res.status(200).json({
        EC: data.EC,
        EM: data.EM,
        DT: data.DT
    })
}

const handleDeleteCourse = async (req, res) => {
    req.body.user = req.user
    let data = await courseService.deleteCourse(req.body.id)
    return res.status(200).json({
        EC: data.EC,
        EM: data.EM,
        DT: data.DT
    })
}

const handleGetOwnerId = async (req, res) => {
    let data = await courseService.getOwnerCourse(req.query.id)
    return res.status(200).json({
        EC: data.EC,
        EM: data.EM,
        DT: data.DT
    })
}

const handleCreateBlog = async (req, res) => {
    req.body.user = req.user
    let data = await blogService.createBlog(req.body)
    return res.status(200).json({
        EC: data.EC,
        EM: data.EM,
        DT: data.DT
    })
}

const handleCreateComment = async (req, res) => {
    req.body.user = req.user
    let data = await blogService.createComment(req.body)
    return res.status(200).json({
        EC: data.EC,
        EM: data.EM,
        DT: data.DT
    })
}

const handleGetBlog = async (req, res) => {
    let data = await blogService.getBlog(req.query)
    return res.status(200).json({
        EC: data.EC,
        EM: data.EM,
        DT: data.DT
    })
}

const handleDeleteBlog = async (req, res) => {
    let data = await blogService.deleteBlog(req.body.blogId)
    return res.status(200).json({
        EC: data.EC,
        EM: data.EM,
        DT: data.DT
    })
}

const handleUpdateBlog = async (req, res) => {
    let data = await blogService.updateBlog(req.body)
    return res.status(200).json({
        EC: data.EC,
        EM: data.EM,
        DT: data.DT
    })
}

const handleDeleteComment = async (req, res) => {
    let data = await blogService.deleteComment(req.body.id)
    return res.status(200).json({
        EC: data.EC,
        EM: data.EM,
        DT: data.DT
    })
}

const handleCreateTopic = async (req, res) => {
    let data = await blogService.createTopic(req.body)
    return res.status(200).json({
        EC: data.EC,
        EM: data.EM,
        DT: data.DT
    })
}

const handleDeleteTopic = async (req, res) => {
    let data = await blogService.deleteTopic(req.body.id)
    return res.status(200).json({
        EC: data.EC,
        EM: data.EM,
        DT: data.DT
    })
}

const handleUpdateTopic = async (req, res) => {

}

const handleGetTopic = async (req, res) => {
    let data = await blogService.getTopic()
    return res.status(200).json({
        EC: data.EC,
        EM: data.EM,
        DT: data.DT
    })
}

module.exports = {
    testApi,
    handleRegisterNewUser,
    handleLogin,
    handlegetUserAccount,
    handlegetCourse,
    handleCreateRole,
    handleCreateGroupRole,
    handleCreateCourse,
    handleGetOwnerId,
    handleCreateBlog,
    handleCreateComment,
    handleGetBlog,
    handleDeleteBlog,
    handleUpdateBlog,
    handleDeleteComment,
    handleUpdateCourse,
    handleDeleteCourse,
    handleCreateTopic,
    handleDeleteTopic,
    handleUpdateTopic,
    handleGetTopic,
    handleLogOut
}