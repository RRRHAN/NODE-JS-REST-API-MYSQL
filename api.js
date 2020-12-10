const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))


const port = 1010
app.listen(port, () => {
    console.log(`Run on port ${port}`)
})

let siswa = require('./router_api/siswa')
app.use('/siswa', siswa)

let user = require('./router_api/user')
app.use('/user', user)

let pelanggaran = require('./router_api/pelanggaran')
app.use('/pelanggaran', pelanggaran)

let pelanggaran_siswa = require('./router_api/pelanggaran_siswa')
app.use('/pelanggaran_siswa', pelanggaran_siswa)