import authenticationService from "../service/authenticationService"


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

    return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: '',
    })
}

module.exports = {
    testApi,
    handleRegisterNewUser,
    handleLogin
}