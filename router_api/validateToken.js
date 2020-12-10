const Cryptr = require("cryptr")
const crypt = new Cryptr("rahasia")
const mysql = require("mysql")


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "pelanggaran_siswa"
})
db.connect(error => {
    if (error) {
        console.log(error.message)
    } else {
        console.log("MySQL Connected")
    }
})


module.exports = (req, res, next) => {
    // cek keberadaan "Token" pada request header
    if (req.url == '/auth') {
        next()
    } else if (req.url != '/auth') {
        if (!req.get("Token")) {
            // jika "Token" tidak ada
            res.json({
                message: "Access Forbidden"
            })
        } else {
            let token = req.get("Token")

            let decryptToken = crypt.decrypt(token)

            let sql = "select * from user where ?"

            let param = {
                id_user: decryptToken
            }

            db.query(sql, param, (error, result) => {
                if (error) throw error
                if (result.length > 0) {
                    next()
                } else {
                    res.json({
                        message: "Invalid Token"
                    })
                }
            })
        }

    }
}