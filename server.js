const express = require("express")
const fileUpload = require("express-fileUpload")
const fs = require("fs")
// Documentation on express-fileUpload: https://www.npmjs.com/package/express-fileupload
var moment = require("moment")
const dotenv = require("dotenv")
dotenv.config()
const Temperature = require("./dbSetup/temperatureModel.js")
const app = express()
const connectDB = require("./dbSetup/createDB.js")

connectDB()
app.use(fileUpload())
app.use(express.json())

// Setup an endpoint for /upload
app.post("/upload", async (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No file was uploaded" })
  }

  const file = req.files.file

  const fileName = file.name
  const fileData = JSON.parse(file.data)

  let i = 0

  let dataArr = []
  let beginDate = fileData[i].ts
  let newDoc = {}

  while (i < fileData.length) {
    const data = fileData[i]
    const currTs = data.ts
    const tempVal = data.val

    if (i + 1 < fileData.length) {
      const getCurrYear = parseInt(moment(currTs).format("YYYY"), 10)
      const getNextYear = parseInt(
        moment(fileData[i + 1].ts).format("YYYY"),
        10
      )

      if (getNextYear === getCurrYear) {
        dataArr.push({
          ts: currTs,
          val: tempVal,
        })
      } else {
        finishDate = fileData[i].ts
        dataArr.push({
          ts: currTs,
          val: tempVal,
        })

        newDoc = new Temperature({
          sensorId: fileName.substring(0, fileName.length - 5),
          startDate: beginDate,
          endDate: finishDate,
          measurements: dataArr,
        })

        try {
          await newDoc.save()
        } catch (err) {
          return console.error(err)
        }

        dataArr = []
        beginDate = fileData[i + 1].ts
      }
    } else {
      finishDate = fileData[i].ts

      newDoc = new Temperature({
        sensorId: fileName.substring(0, fileName.length - 5),
        startDate: beginDate,
        endDate: finishDate,
        measurements: dataArr,
      })

      try {
        let saveUser = await newDoc.save(function (err, data) {
          if (err) return console.error(err)
          console.log("Saved to temperature collection.")
        })
      } catch (err) {
        return console.error(err)
      }
    }
    i++
  }

  file.mv(`${__dirname}/uploads/${file.name}`, (err) => {
    if (err) {
      console.log(err)
      return res.status(500).send(err)
    }

    res.json({ fileName: file.name, filePath: `/uploads/${file.name}` })
  })
})

app.get("/data", async (req, res) => {
  try {
    const results = Temperature.find({}, { measurements: 1, sensorId: 1 })

    results.exec(function (err, data) {
      if (err) {
        console.log(err)
      }
      res.status(200).json({
        // Using the first index but a higher index can be used if the number of years the provided data spans across (a single document holds data for one year)
        status: "success",
        measurements: data[0].measurements,
        sensorId: data[0].sensorId,
      })
    })

    const result = await Temperature.deleteMany({})
  } catch (err) {
    throw err
  }
})

const serverPort = process.env.SERVER_PORT

app.listen(serverPort, () => {
  console.log(`Server started on port ${serverPort}`)
})
