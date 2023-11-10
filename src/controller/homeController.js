const handleHelloWorld = (req, res) => {
    const cac = 'harhahaha'
    console.log(req.cookies)
    console.log(req.signCookies)
    return res.render("CRUD.ejs", { cac })
}

module.exports = {
    handleHelloWorld
}