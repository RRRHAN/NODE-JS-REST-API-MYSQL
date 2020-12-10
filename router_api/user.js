const express = require("express")
const app = express()
const mysql = require("mysql")
const bodyParser = require("body-parser")
const cors = require("cors")
const md5 = require("md5")
const Cryptr = require("cryptr")
const crypt = new Cryptr("rahasia")

module.exports = app

let validateToken = require('./validateToken')
app.use(validateToken)

app.use(express.urlencoded({
    extended: true
}))

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

// =============================================================================
// CRUD user
// =============================================================================
app.get("/user", (req, res) => {
    let sql = "select * from user"
    db.query(sql, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                count: result.length,
                user: result
            }
        }
        res.json(response)
    })
})
app.get("/user/:id", (req, res) => {
    let data = {
        id_user: req.params.id
    }
    let sql = "select * from user where ?"
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                count: result.length,
                user: result
            }
        }
        res.json(response)
    })
})
app.post("/user", (req, res) => {

    let data = {
        nama_user: req.body.nama_user,
        username: req.body.username,
        password: md5(req.body.password)
    }

    let sql = "insert into user set ?"

    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + " data inserted"
            }
        }
        res.json(response)
    })
})
app.put("/user", (req, res) => {

    let data = [{
            nama_user: req.body.nama_user,
            username: req.body.username,
            password: md5(req.body.password)
        },

        {
            id_user: req.body.id_user
        }
    ]

    let sql = "update user set ? where ?"

    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + " data updated"
            }
        }
        res.json(response)
    })
})
app.delete("/user/:id", (req, res) => {
    let data = {
        id_user: req.params.id
    }

    let sql = "delete from user where ?"

    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + " data deleted"
            }
        }
        res.json(response)
    })
})

// endpoint login user (authentication)
app.post("/auth", (req, res) => {
    let param = [
        req.body.username,
        md5(req.body.password)
    ]
    // create sql query
    let sql = "select * from user where username = ? and password = ?"
    console.log('1')
    // run query
    db.query(sql, param, (error, result) => {
        if (error) {
            res.json({
                message: error.message
            })
        }
        console.log('2')
        // cek jumlah data hasil query
        if (result.length > 0) {
            // user tersedia
            res.json({
                message: "Logged",
                token: crypt.encrypt(result[0].id_user), // generate token
                data: result
            })
        } else {
            // user tidak tersedia
            res.json({
                message: "Invalid username/password"
            })
        }
    })
})