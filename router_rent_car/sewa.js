const express = require("express")
const app = express()
const mysql = require("mysql")
const bodyParser = require("body-parser")
const cors = require("cors")

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
    database: "rent_car"
})
db.connect(error => {
    if (error) {
        console.log(error.message)
    } else {
        console.log("MySQL Connected")
    }
})

// =============================================================================
// crud sewa
// =============================================================================

app.get("/", (req, res) => {
    let sql = "select * from sewa"
    db.query(sql, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                count: result.length,
                sewa: result
            }
        }
        res.json(response)
    })
})
app.get("/:id", (req, res) => {
    let data = {
        id_sewa: req.params.id
    }
    let sql = "select * from sewa where ?"
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                count: result.length,
                sewa: result
            }
        }
        res.json(response)
    })
})
app.post("/", (req, res) => {

    let data = {
        id_mobil: req.body.id_mobil,
        id_karyawan: req.body.id_karyawan,
        id_pelanggan: req.body.id_pelanggan,
        tgl_sewa: req.body.tgl_sewa,
        tgl_kembali: req.body.tgl_kembali,
        tgl_kembali: req.body.tgl_kembali,
        total_bayar: req.body.total_bayar
    }

    let sql = "insert into sewa set ?"

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
app.put("/", (req, res) => {

    let data = [{
            id_mobil: req.body.id_mobil,
            id_karyawan: req.body.id_karyawan,
            id_pelanggan: req.body.id_pelanggan,
            tgl_sewa: req.body.tgl_sewa,
            tgl_kembali: req.body.tgl_kembali,
            tgl_kembali: req.body.tgl_kembali,
            total_bayar: req.body.total_bayar
        },

        {
            id_sewa: req.body.id_sewa
        }
    ]

    let sql = "update sewa set ? where ?"

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
app.delete("/:id", (req, res) => {
    let data = {
        id_sewa: req.params.id
    }

    let sql = "delete from sewa where ?"

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