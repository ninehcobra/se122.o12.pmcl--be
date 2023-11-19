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
    console.log(req.body)

    let data = await authenticationService.registerNewUser(req.body)

    return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: '',
    })
}

const handleLogin = async (req, res) => {
    console.log(req.body)

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
    let data = await blogService.getBlog(req.query.id)
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
    handleGetBlog
}