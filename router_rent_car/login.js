const express = require("express")
const app = express()
const mysql = require("mysql")
const bodyParser = require("body-parser")
const cors = require("cors")
const md5 = require("md5")
const Cryptr = require("cryptr")
const crypt = new Cryptr("rahasia")

module.exports = app

app.use(express.urlencoded({
    extended: true
}))

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "rent_car"
})
db.connect(error => {
    if (error) {
        console.log(error.message)
    } else {
        console.log("MySQL Connected")
    }
})

app.post("/", (req, res) => {
    let param = [
        req.body.username,
        md5(req.body.password)
    ]


    // create sql query
    let sql = "select * from karyawan where username = ? and password = ?"
    console.log('1')
    // run query
    db.query(sql, param, (error, result) => {
        if (error) {
            res.json({
                message: error.message
            })
        }
        console.log('2')
        if (result.length > 0) {
            res.json({
                message: "Logged",
                token: crypt.encrypt(result[0].id_karyawan), // generate token
                data: result
            })
        } else {
            res.json({
                message: "Invalid username/password"
            })
        }
    })
})