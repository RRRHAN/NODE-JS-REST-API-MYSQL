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
// proses transaksi
// =============================================================================
// end-point menambahkan data pelanggaran siswa 

app.post("/pelanggaran_siswa", (req, res) => {
    let data = {
        id_siswa: req.body.id_siswa,
        id_user: req.body.id_user,
        waktu: moment().format('YYYY-MM-DD HH:mm:ss')
    }

    let pelanggaran = req.body.pelanggaran

    let sql = "insert into pelanggaran_siswa set ?"

    db.query(sql, data, (error, result) => {
        let response = null

        if (error) {
            res.json({
                message: error.message,
                err: 1
            })
        } else {
            let lastID = result.insertId
            let data2 = {
                id_pelanggaran_siswa: lastID,
                id_pelanggaran: pelanggaran
            }
            // create query insert detail_pelanggaran
            let sql = "insert into detail_pelanggaran_siswa set ?"

            db.query(sql, data2, (error, result) => {
                if (error) {
                    res.json({
                        message: error.message,
                        err: 2
                    })
                } else {
                    res.json({
                        message: "Data has been inserted"
                    })
                }
            })
        }
    })
})
// end-point menampilkan data pelanggaran siswa
app.get("/pelanggaran_siswa", (req, res) => {
    // create sql query
    let sql = "select p.id_pelanggaran_siswa, p.id_siswa,p.waktu, s.nis, s.nama_siswa, p.id_user, u.nama_user " +
        "from pelanggaran_siswa as p join siswa as s on p.id_siswa = s.id_siswa " +
        "join user as u on p.id_user = u.id_user"

    // run query
    db.query(sql, (error, result) => {
        if (error) {
            res.json({
                message: error.message
            })
        } else {
            res.json({
                count: result.length,
                pelanggaran_siswa: result
            })
        }
    })
})
// end-point untuk menampilkan detail pelanggaran
app.get("/pelanggaran_siswa/:id_pelanggaran_siswa", (req, res) => {
    let param = {
        id_pelanggaran_siswa: req.params.id_pelanggaran_siswa
    }

    let sql = "select p.nama_pelanggaran, p.poin " +
        "from detail_pelanggaran_siswa dps join pelanggaran p " +
        "on p.id_pelanggaran = dps.id_pelanggaran " +
        "where ?"

    db.query(sql, param, (error, result) => {
        if (error) {
            res.json({
                message: error.message
            })
        } else {
            res.json({
                count: result.length,
                detail_pelanggaran_siswa: result
            })
        }
    })
})
// end-point untuk menghapus data pelanggaran_siswa
app.delete("/pelanggaran_siswa/:id_pelanggaran_siswa", (req, res) => {
    let param = {
        id_pelanggaran_siswa: req.params.id_pelanggaran_siswa
    }

    let sql = "delete from detail_pelanggaran_siswa where ?"

    db.query(sql, param, (error, result) => {
        if (error) {
            res.json({
                message: error.message
            })
        } else {
            let param = {
                id_pelanggaran_siswa: req.params.id_pelanggaran_siswa
            }
            let sql = "delete from pelanggaran_siswa where ?"

            db.query(sql, param, (error, result) => {
                if (error) {
                    res.json({
                        message: error.message
                    })
                } else {
                    res.json({
                        message: "Data has been deleted"
                    })
                }
            })
        }
    })
})