import db from "../models/index"

const createBlog = async (data) => {
    if (data && data.title && data.description && data.user) {
        try {
            await db.Blog.create({
                ownerId: data.user.id,
                title: data.title,
                description: data.description,
                thumbnail: data.thumbnail ? data.thumbnail : 'https://tse2.mm.bing.net/th?id=OIP.KLSv-elji-ommAvjmQoEMAHaFj&pid=Api&P=0&h=220'
            })
            return {
                EC: 0,
                EM: 'Create Blog success'
            }
        } catch (error) {
            return {
                EC: -1,
                EM: 'Something wrongg on server'
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

const createComment = async (data) => {
    if (data && data.content && data.user && (data.blogId || data.commentId)) {
        try {
            await db.Comment.create({
                blogId: data.blogId ? data.blogId : null,
                commentId: data.commentId ? data.commentId : null,
                ownerId: data.user.id,
                content: data.content,
            })
            return {
                EC: 0,
                EM: 'Create Comment success'
            }
        } catch (error) {
            return {
                EC: -1,
                EM: 'Something wrongg on server'
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

const getBlog = async (data) => {
    if (data && data.id) {
        try {
            let data = await db.Blog.findOne(
                {
                    where: {
                        id: data.id
                    },
                    include: {
                        model: db.Comment,
                        include: {
                            model: db.User,
                            attributes: ["name", "avatar", "id/"]
                        }
                    }
                }
            )
            for (let i = 0; i < data.Comments.length; i++) {
                console.log(data.Comments[i].dataValues.id)
                let repplies = await db.Comment.findAll({
                    where: {
                        commentId: data.Comments[i].dataValues.id,
                        blogId: null
                    },
                    include: {
                        model: db.User,
                        attributes: ["name", "avatar", "id/"]
                    }
                })
                if (repplies) {
                    data.Comments[i].dataValues.Repplies = repplies
                }
                else {
                    data.Comments[i].dataValues.Repplies = {}
                }
            }


            return {
                EC: 0,
                EM: 'Get blog success',
                DT: data
            }
        } catch (error) {
            return {
                EC: -1,
                EM: 'Something wrongg on server',
                DT: error
            }
        }
    }
    else {
        if (data.page && data.limit) {
            let page = parseInt(data.page)
            let limit = parseInt(data.limit)
            let offset = (page - 1) * limit
            let { count, rows } = await db.Blog.findAndCountAll({
                include: {
                    model: db.User,
                    attributes: ["name", "avatar", "id"]
                },
                offset: offset,
                limit: limit
            }
            )
            return {
                EC: 0,
                EM: 'Get blog done',
                DT: {
                    totalRows: count,
                    totalPages: Math.ceil(count / limit),
                    blogs: rows
                }
            }
        }
        else {
            try {
                let data = await db.Blog.findAll({
                    include: {
                        model: db.User,
                        attributes: ["name", "avatar", "id/"]
                    }
                })

                return {
                    EC: 0,
                    EM: 'Get all blog success',
                    DT: data
                }
            } catch (error) {
                return {
                    EC: -1,
                    EM: 'Something wrongg on server'
                }
            }
        }

    }
}

const deleteBlog = async (id) => {
    try {
        if (id) {
            await db.Blog.destroy(
                {
                    where: {
                        id: id
                    }
                }
            )
                .then(
                    await db.Comment.destroy(
                        {
                            where: {
                                blogId: id
                            }
                        }
                    )
                )
            return {
                EC: 0,
                EM: 'Remove Blog success'
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
            EM: 'Something wrongg on server'
        }
    }
}

const updateBlog = async (data) => {
    if (data && data.id) {
        try {
            await db.Blog.update({
                title: data.title,
                description: data.description,
                thumbnail: data.thumbnail
            }, {
                where: {
                    id: data.id
                }
            });
            return {
                EC: 0,
                EM: 'Update Blog success'
            }
        } catch (error) {
            return {
                EC: -1,
                EM: 'Something wrongg on server'
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

const deleteComment = async (commentId) => {
    if (commentId) {
        try {
            await db.Comment.destroy(
                {
                    where: {
                        id: commentId
                    }
                }
            )
            return {
                EC: 0,
                EM: 'Remove Comment success'
            }
        } catch (error) {
            return {
                EC: -1,
                EM: 'Something wrongg on server'
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

const createTopic = async (data) => {
    if (data && data.type && data.description) {
        try {
            await db.Topic.create({
                type: data.type,
                description: data.description
            })
            return {
                EC: 0,
                EM: 'Create topic success'
            }
        } catch (error) {
            return {
                EC: -1,
                EM: "Something wrong on server"
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

const deleteTopic = async (id) => {
    if (id) {
        try {
            await db.Topic.destroy({
                where: {
                    id: id
                }
            })
            return {
                EC: 0,
                EM: "Delete topic success"
            }
        } catch (error) {
            return {
                EC: -1,
                EM: "Something wrong on server"
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

const getTopic = async () => {
    try {
        let data = await db.Topic.findAll()
        return {
            EC: 0,
            EM: 'Get topic success',
            DT: data
        }
    } catch (error) {
        return {
            EC: -1,
            EM: "Something wrong on server"
        }
    }
}

const updateTopic = async () => {

}

module.exports = {
    createBlog,
    createComment,
    getBlog,
    deleteBlog,
    updateBlog,
    deleteComment,
    createTopic,
    deleteTopic,
    getTopic,
    updateTopic,
}