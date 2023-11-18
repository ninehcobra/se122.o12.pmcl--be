import db from "../models/index"


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

module.exports = {
    getCourse
}