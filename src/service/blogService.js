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
    if (data && data.content && data.user && data.blogId) {
        try {
            await db.Comment.create({
                blogId: data.blogId,
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

const getBlog = async (id) => {
    if (id) {
        try {
            let data = await db.Blog.findOne(
                {
                    where: {
                        id: id
                    },
                    include: {
                        model: db.Comment,
                        include: {
                            model: db.User,
                            attributes: ["name", "avatar"]
                        }
                    }
                }
            )
            return {
                EC: 0,
                EM: 'Get blog success',
                DT: data
            }
        } catch (error) {
            return {
                EC: -1,
                EM: 'Something wrongg on server'
            }
        }
    }
    else {
        try {
            let data = await db.Blog.findAll()

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



module.exports = {
    createBlog,
    createComment,
    getBlog
}