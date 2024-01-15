import chapter from "../models/chapter";
import db from "../models/index"
import axios from "axios"
const { Op } = require('sequelize');

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
        console.log(courseId, userId)
        let course = null
        if (courseId) {
            course = await db.Course.findOne(
                {
                    where: {
                        id: courseId
                    },
                    order: [[{ model: db.Chapter }, 'position', 'ASC']],

                    include: [{
                        model: db.Chapter,
                        include: [
                            {
                                model: db.Lesson,// Thêm include cho bài học trong mỗi chương
                                include: [
                                    {
                                        model: db.VideoLesson,
                                        required: false,
                                    },
                                    {
                                        model: db.ReadingLesson,
                                        required: false,
                                    },
                                    {
                                        model: db.QuizzesLesson,
                                        required: false,
                                    },
                                ],
                            }
                        ],
                    },
                    {
                        model: db.Category,
                        attributes: ['name']
                    }]

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
            EM: 'Something wrong on server',
            DT: error
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

            if (course.updateOverview) {
                await db.Course.update({
                    title: course.title,
                    description: course.description,
                    thumbnail: course.thumbnail,
                    categoryId: course.categoryId,
                    newPrice: course.newPrice,
                    isPublished: course.isPublished,
                    updatedAt: new Date(),
                    overview: course.overview
                }, {
                    where: {
                        id: course.id
                    }
                })
                return {
                    EC: 0,
                    EM: 'Update course success'
                }
            }
            else {
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

            const newChapter = await db.Chapter.create({
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


// lesson

const createVideoLesson = async (data) => {
    try {
        const videoLesson = await db.VideoLesson.create({
            videoUrl: data
        });
        return videoLesson;
    } catch (error) {
        console.error('Error creating video lesson:', error);
        throw error;
    }
};

const createReadingLesson = async (data) => {
    try {
        const readingLesson = await db.ReadingLesson.create({
            content: data
        });
        return readingLesson;
    } catch (error) {
        console.error('Error creating reading lesson:', error);
        throw error;
    }
};

const createQuizzesLesson = async (quizzesDetails) => {
    try {
        const quizzesLesson = await db.QuizzesLesson.create({
            duration: quizzesDetails.duration,
        });

        // Tạo câu hỏi và lựa chọn từ quizzesDetails.questions
        for (const question of quizzesDetails.questions) {
            const quizQuestion = await db.QuizQuestion.create({
                content: question.content,
                quizzesLessonId: quizzesLesson.id, // Liên kết với bài kiểm tra vừa tạo
            });

            // Tạo lựa chọn cho câu hỏi
            for (const option of question.options) {
                if (option.content && option.content !== '') {
                    await db.QuizOption.create({
                        content: option.content,
                        isCorrect: option.isCorrect,
                        quizQuestionId: quizQuestion.id, // Liên kết với câu hỏi vừa tạo
                    });
                }

            }
        }

        return quizzesLesson
    } catch (error) {
        console.error('Error creating reading lesson:', error);
        throw error;
    }
};

const createLesson = async (lessonData, lessonDetails) => {
    try {
        if (lessonData && lessonData.title && lessonData.duration && lessonData.ChapterId) {
            const lesson = await db.Lesson.create(lessonData);
            switch (lessonData.lessonType) {
                case 'video':

                    const videoLesson = await createVideoLesson(lessonDetails);
                    await lesson.setVideoLesson(videoLesson);
                    break;
                case 'reading':
                    const readingLesson = await createReadingLesson(lessonDetails);
                    await lesson.setReadingLesson(readingLesson);
                    break;
                case 'quiz':
                    const quizzesLesson = await createQuizzesLesson(lessonDetails);
                    await lesson.setQuizzesLesson(quizzesLesson);
                    break;
                // Các trường hợp khác nếu có
                default:
                    break;
            }

            return {
                EC: 0,
                EM: 'Create lesson success'
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
            EM: 'Create lesson fail',
            DT: error
        }
    }
};
// 



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
                    include: [{
                        model: db.Course,
                        attributes: ['ownerId']
                    },
                    {
                        model: db.Lesson, // Thêm model Lesson vào include
                        include: [{
                            model: db.ReadingLesson, // Thêm model ReadingLesson vào include
                        },
                        {
                            model: db.QuizzesLesson, // Thêm model QuizzesLesson vào include
                        },
                        {
                            model: db.VideoLesson, // Thêm model VideoLesson vào include
                        }],
                    }],
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

const getUserCourse = async (userId, categoryId, page, limit, searchQuery) => {
    try {
        console.log(searchQuery)
        // Kiểm tra userId
        if (!userId) {
            return {
                EC: -2,
                EM: 'Missing userId parameter'
            };
        }

        // Chuyển đổi page và limit thành số nguyên
        page = parseInt(page);
        limit = parseInt(limit);

        // Tính toán offset
        const offset = (page - 1) * limit;

        // Xây dựng điều kiện where chung
        const commonWhereClause = {
            isPublished: true,
        };

        // Thêm điều kiện tìm kiếm theo tên
        if (searchQuery) {
            commonWhereClause.title = {
                [Op.like]: `%${searchQuery}%`,
            };
        }

        // Thêm điều kiện categoryId nếu có
        if (categoryId) {
            commonWhereClause.categoryId = categoryId;
        }

        // Tìm và đếm các khóa học
        const { count, rows } = await db.Course.findAndCountAll({
            where: commonWhereClause,
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: db.Purchase,
                    where: { userId: userId },
                    required: false,
                },
                {
                    model: db.Category,
                    attributes: ['id', 'name'],
                },
                {
                    model: db.Chapter,
                    where: { isPublished: true },
                    attributes: ['id'],
                },
            ],
            offset: offset,
            limit: limit,
        });

        // Lấy danh sách khóa học và tổng số lượng
        const courses = rows;
        const totalCount = count;

        // Tính toán tiến trình và gán vào mỗi khóa học
        const coursesWithProgress = await Promise.all(
            courses.map(async (course) => {
                const progressPercent =
                    course.dataValues.Purchases.length === 0
                        ? null
                        : await getProgress(userId, course.dataValues.id);
                return {
                    ...course.dataValues,
                    progress: progressPercent,
                };
            })
        );

        // Trả về kết quả
        return {
            EC: 0,
            EM: 'success',
            DT: {
                totalRows: totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: page,
                pageSize: limit,
                products: coursesWithProgress,
            },
        };
    } catch (error) {
        // Xử lý lỗi
        return {
            EC: -1,
            EM: 'Something wrong on server',
            DT: error
        };
    }
};


const getUserListChapter = async (data) => {
    try {
        if (data && data.courseId && data.userId) {
            console.log('vo day r ne ', data.courseId)

            let res = await db.Course.findOne({
                where: {
                    id: data.courseId
                },
                include: [
                    {
                        model: db.Chapter,
                        where: {
                            isPublished: true
                        },
                        include: {
                            model: db.Lesson,
                            include: [
                                {
                                    model: db.ReadingLesson
                                },
                                {
                                    model: db.VideoLesson
                                }
                                , {
                                    model: db.QuizzesLesson
                                }
                            ]
                        }
                    }
                ]
            })

            res.dataValues.Chapters.forEach(chapter => {
                chapter.dataValues.duration = 0
                chapter.dataValues.Lessons.forEach(lesson => {
                    // Kiểm tra loại bài học và cộng thời lượng tương ứng
                    chapter.dataValues.duration += lesson.dataValues.duration
                });
            })

            let userInfo = await db.User.findOne({
                where: {
                    id: res.dataValues.ownerId
                },
                attributes: ['id', 'name']
            })


            let progress = await getProgress(data.userId, data.courseId)

            res.dataValues.progress = progress

            res.dataValues.User = userInfo.dataValues

            return {
                EC: 0,
                EM: 'Get list Chapter success',
                DT: res
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

const getProgress = async (userId, courseId) => {
    try {
        // Lấy danh sách tất cả các chapter thuộc course đã xuất bản
        let publishedChapters = await db.Chapter.findAll({
            where: {
                courseId: courseId,
                isPublished: true
            }
        });

        // Lấy danh sách id của các chapter đã xuất bản
        let publishedChapterIds = publishedChapters.map((chapter) => chapter.id);

        // Lấy danh sách tất cả các lesson thuộc các chapter đã xuất bản
        let publishedLessons = await db.Lesson.findAll({
            where: {
                chapterId: {
                    [Op.in]: publishedChapterIds
                },
            }
        });

        // Lấy danh sách id của các lesson đã xuất bản
        let publishedLessonIds = publishedLessons.map((lesson) => lesson.id);

        // Lấy số lượng lesson đã hoàn thành bởi người dùng
        const validCompletedLessons = await db.FinishLesson.count({
            where: {
                userId: userId,
                lessonId: {
                    [Op.in]: publishedLessonIds
                },
                isCompleted: true
            }
        });

        // Tính toán tỷ lệ tiến độ
        const progressPercentage = (validCompletedLessons / publishedLessonIds.length) * 100;

        return progressPercentage;
    } catch (error) {
        console.error('Get progress error:', error);
        // Có thể ném lỗi hoặc trả giá trị mặc định tùy thuộc vào logic xử lý của bạn
        throw error;
    }
};

const getUserPurchase = async (data) => {
    try {
        if (data && data.courseId && data.userId) {
            let res = await db.Purchase.findOne({
                where: {
                    courseId: data.courseId,
                    userId: data.userId
                }
            })

            return {
                EC: 0,
                EM: 'Get purchase success',
                DT: res
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

const getChapterDetail = async (data) => {
    try {
        if (data.courseId) {
            let res = await db.Chapter.findOne({
                where: {
                    id: data.courseId,
                    isPublished: true
                },
                include: {
                    model: db.Lesson,
                    include: [
                        {
                            model: db.ReadingLesson
                        },
                        {
                            model: db.VideoLesson
                        }
                        , {
                            model: db.QuizzesLesson,
                            include: [
                                {
                                    model: db.QuizQuestion,
                                    include: [
                                        {
                                            model: db.QuizOption
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    order: [['createdAt', 'DESC']]
                }
            })



            for (let i = 0; i < res.dataValues.Lessons.length; i++) {
                const lesson = res.dataValues.Lessons[i].dataValues;

                const progress = await db.FinishLesson.count({
                    where: {
                        userId: data.userId,
                        lessonId: lesson.id,
                        isCompleted: true
                    }
                })
                res.dataValues.Lessons[i].dataValues.isCompleted = progress === 1 ? true : false;
            }

            return {
                EC: 0,
                EM: 'success',
                DT: res
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

const purchaseCourse = async (data) => {
    try {

        if (data.userId && data.courseId) {
            let res = await db.Purchase.create({
                userId: data.userId,
                courseId: data.courseId
            })

            return {
                EC: 0,
                EM: 'Purchase success',
                DT: res
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

const markCompleteChapter = async (data) => {
    try {
        console.log('chapter Id ne', data.chapterId)



        if (data.userId && data.chapterId) {
            let check = await db.FinishLesson.findOne({
                where: {
                    userId: data.userId,
                    lessonId: data.chapterId,
                    isCompleted: true
                }
            })
            if (check) {
                return {
                    EC: 1,
                    EM: 'You already done this',
                }
            }
            let res = await db.FinishLesson.create({
                userId: data.userId,
                lessonId: data.chapterId,
                isCompleted: true
            })

            return {
                EC: 0,
                EM: 'Mark success',
                DT: res
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
            EM: 'Something wrong on server',
            DT: error
        }
    }
}

const getDashboardCourses = async (data) => {
    try {
        if (data && data.userId) {
            const purchasedCourses = await db.Purchase.findAll({
                where: {
                    userId: data.userId,
                },
                include: {
                    model: db.Course,
                    include: [
                        {
                            model: db.Category,
                        },
                        {
                            model: db.Chapter,
                            where: {
                                isPublished: true,
                            },
                        },
                    ],
                },
            });

            const courses = purchasedCourses.map((purchase) => purchase.dataValues.Course)

            for (let course of courses) {
                const progress = await getProgress(data.userId, course.dataValues.id);
                course.dataValues["progress"] = progress;
            }

            const completedCourses = courses.filter((course) => course.dataValues.progress === 100);
            const coursesInProgress = courses.filter((course) => (course.dataValues.progress ?? 0) < 100);

            return {
                EC: 0,
                EM: 'Get success',
                DT: {
                    coursesInProgress,
                    completedCourses
                }
            }
        }
        else {
            return {
                EC: -2,
                EM: 'Missing parameters',

            }
        }
    } catch (error) {
        return {
            EC: -1,
            EM: 'Something wrong on server',
            DT: error
        }
    }
}

const getAnalytics = async (data) => {
    try {

        const courses = await db.Course.findAll({
            where: {
                ownerId: data.userId,
                isPublished: true
            },
            include: {
                model: db.Purchase
            }
        })

        const purchaseStats = []

        courses.forEach(course => {
            const purchases = course.Purchases || []; // Lấy mảng Purchases hoặc mảng rỗng nếu không có
            const totalPurchases = purchases.length; // Đếm số lượng lượt mua

            // Tính tổng tiền bằng cách nhân giá mới của khóa và số lượng lượt mua
            const totalAmount = course.newPrice * totalPurchases;
            console.log(course.title)
            // Lưu thông tin vào mảng purchaseStatsArray
            purchaseStats.push({
                title: course.title,
                totalPurchases,
                totalAmount
            });
        });

        return {
            EC: 0,
            EM: 'Success',
            DT: purchaseStats
        }
    } catch (error) {
        return {
            EC: -1,
            EM: 'Something wrong on server',
            DT: error
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
    getUserCourse,
    getUserListChapter,
    getUserPurchase,
    getChapterDetail,
    purchaseCourse,
    markCompleteChapter,
    getDashboardCourses,
    getAnalytics,
    createLesson
}