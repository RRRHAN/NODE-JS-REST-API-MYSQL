const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const mysql = require("mysql")


const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

const port = 1010
app.listen(port, () => {
    console.log(`Run on port ${port}`)
})

let karyawan = require('./router_rent_car/karyawan')
app.use('/karyawan', karyawan)

let mobil = require('./router_rent_car/mobil')
app.use('/mobil', mobil)

let pelanggan = require('./router_rent_car/pelanggan')
app.use('/pelanggan', pelanggan)

let sewa = require('./router_rent_car/sewa')
app.use('/sewa', sewa)

let login = require('./router_rent_car/login')
app.use('/login', login)