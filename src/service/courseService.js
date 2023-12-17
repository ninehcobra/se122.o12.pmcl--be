import db from "../models/index"
import axios from "axios"
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: 'dwpz7w8y4',
    api_key: '182458449113114',
    api_secret: 'bQTeHxHz_qJHJO4GTv7SpQuBn1g',
});

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

const getCourseById = async (courseId, userId) => {
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

const getAllCourse = async (data) => {
    try {
        if (data.page && data.limit) {
            let page = parseInt(data.page)
            let limit = parseInt(data.limit)
            let offset = (page - 1) * limit
            let { count, rows } = await db.Course.findAndCountAll({
                where: {
                    ownerId: data.userId
                },
                offset: offset,
                limit: limit,
                order: [['createdAt', 'DESC']]
            }
            )
            return {
                EC: 0,
                EM: 'Get course done',
                DT: {
                    totalRows: count,
                    totalPages: Math.ceil(count / limit),
                    courses: rows
                }
            }
        }


    } catch (error) {
        return {
            EC: -1,
            EM: 'Something wrong on server'
        }
    }
}


const deleteCourse = async (courseId) => {
    if (courseId) {
        try {
            let res = await db.Course.findOne({
                where: {
                    id: courseId
                }
            })

            if (res && res.thumbnail) {
                await deleteImgByUrl(res.thumbnail)
            }

            await db.Course.destroy({
                where: {
                    id: courseId
                }
            })


            let chapters = await db.Chapter.findAll({
                where: {
                    courseId: courseId
                }
            })
            for (const element of chapters) {
                if (element.dataValues.videoUrl) {
                    await deleteVideoByUrl(element.dataValues.videoUrl);
                }
            }
            await db.Chapter.destroy({
                where: {
                    courseId: courseId
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
                videoUrl: chapter.videoUrl,
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

const deleteChapter = async (chapterId) => {
    if (chapterId) {
        try {
            let res = await db.Chapter.findOne({
                where: {
                    id: chapterId
                }
            })

            if (res) {
                if (res && res.videoUrl) {
                    await deleteVideoByUrl(res.videoUrl)
                }
                await db.Chapter.destroy({
                    where: {
                        id: chapterId
                    }
                })
                return {
                    EC: 0,
                    EM: 'Delete success'
                }

            }
            else {
                return {
                    EC: 1,
                    EM: 'Not found'
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

const deleteVideoByUrl = async (videoUrl) => {

    const publicId = videoUrl.match(/\/v\d+\/(.+?)\./)[1]

    // Thực hiện yêu cầu DELETE đến Cloudinary API endpoint để xóa video
    await cloudinary.uploader.destroy(publicId, { resource_type: 'video' }, (error, result) => {
        if (error) {
            console.log('Error deleting video from Cloudinary:', error);
            return error
        } else {
            console.log('Cloudinary response:', result);
            return result
            // Xử lý kết quả xóa video ở đây
        }
    })
};

const deleteImgByUrl = async (imgUrl) => {

    const publicId = imgUrl.match(/\/v\d+\/(.+?)\./)[1]

    // Thực hiện yêu cầu DELETE đến Cloudinary API endpoint để xóa video
    await cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
            console.log('Error deleting img from Cloudinary:', error);
            return error
        } else {
            console.log('Cloudinary response:', result);
            return result
            // Xử lý kết quả xóa video ở đây
        }
    })
};

const getUserCourse = async (userId) => {
    try {
        if (userId) {
            const courses = await db.Course.findAll({
                where: {
                    isPublished: true
                },
                include: [
                    {
                        model: db.User,
                        where: {
                            id: userId
                        },
                        attributes: []
                    }
                ]
            })

            // for (const course of courses) {
            //     if (course.dataValues.Users.length > 0) {
            //         course.dataValues.Users.map((item) => {
            //             if (item.dataValues.id === userId) {

            //             }
            //         })
            //     }
            // }
            courses[0].dataValues.progress = '30%'
            console.log(courses[0].dataValues)

            return {
                EC: 0,
                EM: 'success',
                DT: courses
            }
        }
        else {
            return {
                EC: -2,
                EM: 'Missing parameters'
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
    getCourseById,
    createCourse,
    getAllCourse,
    deleteCourse,
    updateCourse,
    createChapter,
    updateChapterPosition,
    getChapter,
    updateChapter,
    deleteChapter,
    getUserCourse
}