const express = require('express')
var request = require('request')
const router = express.Router()
const app = express()
const port = 5000
const path = require('path')
const fetch = require('node-fetch')
const { response } = require('express')
const Datastore =require('nedb')


require('dotenv').config({ path: path.resolve(__dirname, './.env') })

const apikey = process.env.API_KEY;
const weather_url = `http://api.openweathermap.org/data/2.5/weather?q=minneapolis&appid=${apikey}`
const database = new Datastore('database.db')
database.loadDatabase()
database.insert({name: 'simbamon', status: 'cool'})
database.insert({name: 'simbaman', status: 'nice'})

app.use(express.json())

app.get("/getWeatherMinneapolis", (req, res) => {
    request(
        weather_url, 
        function(error, response, body) {
            if(!error && response.statusCode == 200) {
                var parsedBody = JSON.parse(body)
                var weather = parsedBody.weather[0].main
                res.send(weather)
            }
        }
    )
})

app.post('/api', (req, res) => {
  console.log(req.body)
  const data = req.body
  const timestamp = Date.now()
  data.timestamp = timestamp
  database.insert(data)
  res.json({
    status: 'sucess',
    timestamp: timestamp,
    username: data.username,
    password: data.password,
  })
})

app.get("/getname", async (req, res) => {
  console.log("/getbit endpoint called")
  const url = 'https://api.agify.io?name=meelad'
  const options = {
    "method": "GET",
  }
  const response = await fetch(url, options)
    .then(res => res.json())
    .catch(e => {
      console.error({
        "message": "Error",
        error: e,
      })
    })
  console.log("RESPONSE: ", response)
  res.send(response.name)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})