require('dotenv').config()
const express = require("express")
const bodyParser=require("body-parser")
const helmet=require("helmet")
const service=require("./service")
const CronJob = require('cron').CronJob
const app = express()
app.set('view engine', 'ejs')
.use(bodyParser.json())
.use(bodyParser.urlencoded({ extended: false }))
.use(helmet())
.get('/', (req, res)=>res.render('home'))
.post('/api/add', (req, res)=>service.add(req,res))
.post('/api/removeAll', (req, res)=> service.removeAll(req,res))
.get('/api/getAll', (req, res)=>service.getAll(req,res))
.listen(process.env.PORT, async() =>init())
init=()=>{
    service.init()
    console.log(`app listening on port ${process.env.PORT}!`)
    new CronJob('*/5 * * * *', function() {
        service.checkHealth()
    }, null, true)
}
module.exports = app