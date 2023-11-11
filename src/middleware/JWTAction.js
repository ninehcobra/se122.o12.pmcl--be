import jwt from "jsonwebtoken"
require("dotenv").config()

const nonSecurePaths = ['/', '/register', '/login']


const createJWT = (payload) => {

    let token = null
    try {
        token = jwt.sign(payload, process.env.JWT_SECRET);
    } catch (error) {
        console.log(error)
    }


    return token
}

let verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
}

const checkUserPermission = (req, res, next) => {
    if (nonSecurePaths.includes(req.path)) return next();
    if (req.user) {
        let email = req.user.email
        let roles = req.user.roles.Roles
        let currentUrl = req.path
        if (!roles || roles.length === 0) {
            return res.status(403).json({
                EC: -1,
                DT: '',
                EM: `You don't have permission to access this resources`
            })
        }
        console.log(currentUrl)
        let canAccess = roles.some(item => item.url === currentUrl)
        if (canAccess) {
            next()
        }
        else {
            return res.status(403).json({
                EC: -1,
                DT: '',
                EM: `You don't have permission to access this resources`
            })
        }


    }
    else {
        return res.status(401).json({
            EC: -1,
            DT: '',
            EM: 'Not authenticated the user'
        })
    }
}

const checkUserJWT = async (req, res, next) => {
    if (nonSecurePaths.includes(req.path)) return next();
    let cookies = req.cookies;
    if (cookies && cookies.jwt) {
        let token = cookies.jwt.access_token

        let decoded = await verifyToken(token)
        if (decoded) {
            req.user = decoded

            next()
        }
        else {
            return res.status(401).json({
                EC: -1,
                DT: '',
                EM: 'Not authenticated the user'
            })
        }
    }
    else {
        return res.status(401).json({
            EC: -1,
            DT: '',
            EM: 'Not authenticated the user'
        })
    }
}

module.exports = {
    createJWT,
    verifyToken,
    checkUserJWT,
    checkUserPermission
}