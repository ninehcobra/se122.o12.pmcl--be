import db from "../models/index"


const createCourse = async (data) => {
    if (data && data.title && data.user) {
        try {
            let res = await db.Course.create({
                title: data.title,
                ownerId: data.user.id,
                isPublished: false
            })
            return {
                EC: 0,
                EM: 'Create course success',
                DT: {
                    id: res.id
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
            EM: 'Missing parameters'
        }
    }
}

const getCourse = async (courseId, userId) => {
    try {

        let course = null
        if (courseId) {
            course = await db.Course.findOne(
                {
                    where: {
                        id: courseId
                    },
                    order: [[{ model: db.Chapter }, 'position', 'ASC']]
                    ,
                    include: [{
                        model: db.User,
                        attributes: ['id'],
                        through: { attributes: [] }
                    },
                    {
                        model: db.Category,
                        attributes: ['name']
                    }
                        ,
                    {
                        model: db.Chapter
                    }
                    ]
                }
            )
            if (course.ownerId !== userId) {
                return {
                    EC: 3,
                    EM: `This course doesn't belong to you`
                }
            }
            if (course) {
                return {
                    EC: 0,
                    EM: 'Get course success',
                    DT: course
                }
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
    let course = data.data
    if (data && course.id) {
        try {
            await db.Course.update({
                title: course.title,
                description: course.description,
                thumbnail: course.thumbnail,
                categoryId: course.categoryId,
                newPrice: course.newPrice,
                isPublished: course.isPublished,
                updatedAt: new Date(),

            }, {
                where: {
                    id: course.id
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

const createChapter = async (data) => {

    if (data && data.courseId && data.title) {
        try {

            let lastChapter = await db.Chapter.findOne({
                where: {
                    courseId: data.courseId
                },
                order: [['position', 'DESC']]
            })

            console.log(lastChapter)

            let position = lastChapter ? lastChapter.position + 1 : 0

            await db.Chapter.create({
                title: data.title,
                courseId: data.courseId,
                position: position,
                isPublished: false,
                isFree: false
            })
            return {
                EC: 0,
                EM: 'Create chapter success'
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

const updateChapterPosition = async (data) => {

    if (data && Array.isArray(data)) {
        try {
            for (let item of data) {
                console.log(item)
                await db.Chapter.update({
                    position: item.position
                }, {
                    where: {
                        id: item.id
                    }
                })
            }
            return {
                EC: 0,
                EM: 'Update chapter success'
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

const getChapter = async (chapterId, userId) => {
    try {
        let chapter = null
        if (chapterId) {
            console.log('vo ne')
            chapter = await db.Chapter.findOne(
                {
                    where: {
                        id: chapterId
                    },
                    include: {
                        model: db.Course,
                        attributes: ['ownerId']
                    }
                }
            )

            if (chapter && chapter.Course.ownerId === userId) {
                return {
                    EC: 0,
                    EM: 'Get chapter success',
                    DT: chapter
                }
            }
            else {
                return {
                    EC: 2,
                    EM: 'This chapter does not belong to you'
                }
            }
        }
        else {
            return {
                EC: 1,
                EM: 'Not found chapter'
            }
        }
    } catch (error) {
        return {
            EC: -1,
            EM: 'Something wrong on server'
        }
    }
}

const updateChapter = async (data) => {
    let chapter = data.data
    if (data && chapter.id) {
        try {
            await db.Chapter.update({
                title: chapter.title,
                description: chapter.description,
                videoUrl: chapter.thumbnail,
                isPublished: chapter.isPublished,
                isFree: chapter.isFree,
                updatedAt: new Date(),

            }, {
                where: {
                    id: chapter.id
                }
            })
            return {
                EC: 0,
                EM: 'Update chapter success'
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
    createChapter,
    updateChapterPosition,
    getChapter,
    updateChapter
}