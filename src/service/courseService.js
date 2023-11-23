import db from "../models/index"


const createCourse = async (data) => {

    if (data && data.title && data.description && data.user && data.newPrice) {
        if (data.oldPrice && data.newPrice > data.oldPrice) {
            return {
                EC: 1,
                EM: 'Wrong inputs'
            }
        }
        try {
            await db.Course.create({
                newPrice: data.newPrice,
                oldPrice: data.oldPrice ? data.oldPrice : data.newPrice,
                title: data.title,
                description: data.description,
                ownerId: data.user.id,
                thumbnail: data.thumbnail ? data.thumbnail : 'https://tse1.mm.bing.net/th?id=OIP.Fr_PPosK1nc2m2CKfV9t9gHaE4&pid=Api&P=0&h=220'
            })
            return {
                EC: 0,
                EM: 'Create course success'
            }

        } catch (error) {
            return {
                EC: -1,
                EM: 'Something wrong on server'
            }
        }
    }
    else {
        return {
            EC: -2,
            EM: 'Missing parameters'
        }
    }
}

const getCourse = async (courseId) => {
    try {
        let course = null
        if (courseId) {
            course = await db.Course.findOne(
                {
                    where: {
                        id: courseId
                    }
                    ,
                    include: {
                        model: db.User,
                        attributes: ['id'],
                        through: { attributes: [] }
                    }
                }
            )
        }
        else {
            course = await db.Course.findAll(
                {
                    include: {
                        model: db.User,
                        attributes: ['id'],
                        through: { attributes: [] }
                    }
                }
            )
        }
        if (course) {
            return {
                EC: 0,
                EM: 'Get course success',
                DT: course
            }
        }
        else {
            return {
                EC: 1,
                EM: 'Not found course'
            }
        }
    } catch (error) {
        return {
            EC: -1,
            EM: 'Something wrong on server'
        }
    }
}

const getOwnerCourse = async (ownerId) => {
    if (ownerId) {
        console.log(ownerId)
        try {
            let courses = await db.Course.findAll({
                where: {
                    ownerId: ownerId
                }
            })
            if (courses) {
                return {
                    EC: 0,
                    EM: 'Get OwnCourse success',
                    DT: courses
                }
            }
            else {
                return {
                    EC: 1,
                    EM: 'No course have found'
                }
            }

        } catch (error) {
            return {
                EC: -1,
                EM: 'Something wrong on server'
            }
        }
    }
    else {
        return {
            EC: -2,
            EM: 'Missing parameter'
        }
    }
}

const deleteCourse = async (courseId) => {
    if (courseId) {
        try {
            await db.Course.destroy({
                where: {
                    id: courseId
                }
            })
            return {
                EC: 0,
                EM: 'Delete success'
            }
        } catch (error) {
            return {
                EC: -1,
                EM: 'Something wrong on server'
            }
        }
    }
    else {
        return {
            EC: -2,
            EM: 'Missing parameter'
        }
    }
}

const updateCourse = async (data) => {
    if (data && data.id && data.title && data.description) {
        try {
            await db.Course.update({
                title: data.title,
                description: data.description,
                thumbnail: data.thumbnail
            }, {
                where: {
                    id: data.id
                }
            })
            return {
                EC: 0,
                EM: 'Update course success'
            }
        } catch (error) {
            return {
                EC: -1,
                EM: 'Something wrong on server'
            }
        }
    }
    else {
        return {
            EC: -2,
            EM: 'Missing parameter'
        }
    }
}



module.exports = {
    getCourse,
    createCourse,
    getOwnerCourse,
    deleteCourse,
    updateCourse,

}