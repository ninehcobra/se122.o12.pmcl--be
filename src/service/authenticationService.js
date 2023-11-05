import db from "../models/index"
import bcrypt from 'bcrypt'
import { Op } from "sequelize"

const salt = bcrypt.genSaltSync(10)

const hashPassword = (userPassword) => {
    let hashPassword = bcrypt.hashSync(userPassword, salt);
    return hashPassword
}

const registerNewUser = async (rawUserData) => {
    try {
        if (rawUserData && rawUserData.email && rawUserData.password && rawUserData.name) {
            if (await checkEmail(rawUserData.email)) {
                return {
                    EM: 'Email is already exist',
                    EC: 1
                }
            }
            else {
                let hashpassword = hashPassword(rawUserData.password)

                await db.User.create({
                    email: rawUserData.email,
                    password: hashpassword,
                    name: rawUserData.name
                })

                return {
                    EM: 'A user is created successfully',
                    EC: 0
                }
            }
        }
        else {
            return {
                EM: 'Missing parameters',
                EC: 2,
            }
        }
    } catch (e) {
        console.log(e)
        return {
            EM: 'Something wrongs in service...',
            EC: -2,
        }
    }
}

const checkEmail = async (userEmail) => {
    let user = await db.User.findOne({
        where: { email: userEmail }
    })
    if (user)
        return true
    return false
}

const login = async (rawUserData) => {
    try {
        if (rawUserData && rawUserData.email && rawUserData.password) {
            let user = await db.User.findOne({
                where: {
                    email: rawUserData.email
                }
            });

            if (user) {
                const match = await bcrypt.compare(rawUserData.password, user.password);
                if (match) {
                    return {
                        EM: 'success',
                        EC: 0,
                        DT: {
                            access_token: ''
                        }
                    };
                } else {
                    return {
                        EM: 'Wrong password',
                        EC: 3
                    };
                }
            } else {
                return {
                    EM: `This email isn't exist`,
                    EC: 1
                };
            }
        } else {
            return {
                EM: 'Missing parameters',
                EC: 2
            };
        }
    } catch (error) {
        console.error(error);
        return {
            EM: 'Something wrongs in service...',
            EC: -2
        };
    }
};

module.exports = {
    registerNewUser,
    login
}