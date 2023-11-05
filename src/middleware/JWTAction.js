import jwt from "jsonwebtoken"
require("dotenv").config()

const createJWT = () => {

    let token = null
    try {
        token = jwt.sign({ name: 'congchinh' }, process.env.JWT_SECRET);
        console.log(token)
    } catch (error) {
        console, log(error)
    }


    return token
}

const verifyToken = (token) => {
    let data = null
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
        if (err) {
            console.log(err)
            return data
            /*
              err = {
                name: 'JsonWebTokenError',
                message: 'jwt malformed'
              }
            */
        }
        console.log(decoded)
        return decoded
    });
}

module.exports = {
    createJWT,
    verifyToken
}