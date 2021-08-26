const mongoose = require("mongoose")

const temperatureSchema = new mongoose.Schema({
  sensorId: String,
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  measurements: [Object],
})

const Temperature = mongoose.model("Temperature", temperatureSchema)

module.exports = Temperature
