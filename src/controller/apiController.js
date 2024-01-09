import authenticationService from "../service/authenticationService"
import courseService from "../service/courseService"
import JWTService from "../service/JWTService"
import blogService from "../service/blogService"
import categoryService from "../service/categoryService"


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

const handlegetCourseById = async (req, res) => {
    console.log(req.user)
    let data = await courseService.getCourseById(req.query.id, req.user.id)
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

const handleGetAllCourse = async (req, res) => {
    req.body.userId = req.user.id
    let data = await courseService.getAllCourse(req.body)
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

const handleCreateCategory = async (req, res) => {
    let data = await categoryService.createCategory(req.body.name)
    return res.status(200).json({
        EC: data.EC,
        EM: data.EM,
        DT: data.DT
    })
}

const handleGetCategory = async (req, res) => {
    let data = await categoryService.getCategory()
    return res.status(200).json({
        EC: data.EC,
        EM: data.EM,
        DT: data.DT
    })
}

const handleCreateChapter = async (req, res) => {
    let data = await courseService.createChapter(req.body)
    return res.status(200).json({
        EC: data.EC,
        EM: data.EM,
        DT: data.DT
    })
}

const handleUpdateChapterPosition = async (req, res) => {
    let data = await courseService.updateChapterPosition(req.body)
    return res.status(200).json({
        EC: data.EC,
        EM: data.EM,
        DT: data.DT
    })
}

const handleGetChapter = async (req, res) => {
    console.log(req.query.id, req.user.id)
    let data = await courseService.getChapter(req.query.id, req.user.id)
    return res.status(200).json({
        EC: data.EC,
        EM: data.EM,
        DT: data.DT
    })
}

const handleUpdateChapter = async (req, res) => {
    req.body.user = req.user
    let data = await courseService.updateChapter(req.body)
    return res.status(200).json({
        EC: data.EC,
        EM: data.EM,
        DT: data.DT
    })
}

const handleDeleteChapter = async (req, res) => {
    let data = await courseService.deleteChapter(req.body.id)
    return res.status(200).json({
        EC: data.EC,
        EM: data.EM,
        DT: data.DT
    })
}

const handleGetUserCourse = async (req, res) => {
    console.log(req.body)
    let data = await courseService.getUserCourse(req.user.id, req.body.categoryId, req.body.page, req.body.limit, req.body.search)
    return res.status(200).json({
        EC: data.EC,
        EM: data.EM,
        DT: data.DT
    })
}

const handleGetUserListChapter = async (req, res) => {
    let data = await courseService.getUserListChapter({
        userId: req.user.id,
        courseId: req.body.id
    })
    return res.status(200).json({
        EC: data.EC,
        EM: data.EM,
        DT: data.DT
    })
}

const handleGetUserPurchase = async (req, res) => {
    let data = await courseService.getUserPurchase({
        userId: req.user.id,
        courseId: req.body.id
    })
    return res.status(200).json({
        EC: data.EC,
        EM: data.EM,
        DT: data.DT
    })
}

const handleGetChapterDetail = async (req, res) => {
    let data = await courseService.getChapterDetail({ courseId: req.query.id, userId: req.user.id })
    return res.status(200).json({
        EC: data.EC,
        EM: data.EM,
        DT: data.DT
    })
}
const handlePurchaseCourse = async (req, res) => {
    let data = await courseService.purchaseCourse({
        userId: req.user.id,
        courseId: req.body.id
    })
    return res.status(200).json({
        EC: data.EC,
        EM: data.EM,
        DT: data.DT
    })
}

const handleMarkCompleteChapter = async (req, res) => {
    let data = await courseService.markCompleteChapter({
        userId: req.user.id,
        chapterId: req.body.id
    })
    return res.status(200).json({
        EC: data.EC,
        EM: data.EM,
        DT: data.DT
    })
}

const handleGetDashboardCourses = async (req, res) => {
    let data = await courseService.getDashboardCourses({
        userId: req.user.id
    })
    return res.status(200).json({
        EC: data.EC,
        EM: data.EM,
        DT: data.DT
    })
}

const handleGetAnalytics = async (req, res) => {
    let data = await courseService.getAnalytics({
        userId: req.user.id
    })
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
    handlegetCourseById,
    handleCreateRole,
    handleCreateGroupRole,
    handleCreateCourse,
    handleGetAllCourse,
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
    handleLogOut,
    handleCreateCategory,
    handleGetCategory,
    handleCreateChapter,
    handleUpdateChapterPosition,
    handleGetChapter,
    handleUpdateChapter,
    handleDeleteChapter,
    handleGetUserCourse,
    handleGetUserListChapter,
    handleGetUserPurchase,
    handleGetChapterDetail,
    handlePurchaseCourse,
    handleMarkCompleteChapter,
    handleGetDashboardCourses,
    handleGetAnalytics
}