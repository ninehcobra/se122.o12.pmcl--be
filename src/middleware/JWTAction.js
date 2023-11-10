import jwt from "jsonwebtoken"
require("dotenv").config()

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

const checkUserJWT = async (req, res, next) => {
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
    checkUserJWT
}