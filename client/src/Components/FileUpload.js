import React, { Fragment, useState, useEffect } from "react"
import axios from "axios"
import CreateChart from "./CreateChart.js"

const FileUpload = () => {
  const [file, setFile] = useState("")
  const [fileName, setFilename] = useState("Choose File")
  const [uploadedFile, setUploadedFile] = useState({})
  const [isUploadedFile, setIsUploadedFile] = useState(false)
  const [chartData, setChartData] = useState({})
  const [isButtonClicked, setIsButtonClicked] = useState(false)
  const [sensorName, setSensorName] = useState("")

  useEffect(() => {
    if (isButtonClicked) {
      async function fetchData() {
        const results = await axios.get("/data")
        const tsArray = results.data.measurements.map((measurement) => {
          return measurement.ts
        })

        setSensorName(results.data.sensorId)

        const valArray = results.data.measurements.map((measurement) => {
          return measurement.val
        })

        setChartData({
          labels: tsArray,
          datasets: valArray,
        })
      }
      fetchData()
    }
  }, [isButtonClicked])

  const handleChange = (e) => {
    setFile(e.target.files[0])
    setFilename(e.target.files[0].name)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()

    formData.append("file", file)

    try {
      const res = await axios.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      const { fileName, filePath } = res.data

      setUploadedFile({ fileName, filePath })
      setIsUploadedFile(true)
    } catch (err) {
      if (err) {
        console.log("There was a problem with the server")
      } else {
        console.log(err.response.data.msg)
      }
    }
  }

  return (
    <Fragment>
      <form onSubmit={handleSubmit}>
        <div className='custom-file mb-4'>
          <input
            type='file'
            className='custom-file-input'
            id='customFile'
            onChange={handleChange}
          />
          <label className='custom-file-label' htmlFor='customFile'>
            {fileName}
          </label>
        </div>

        <input
          data-testid='fileBrowseButton'
          type='submit'
          value='Send'
          className='btn btn-primary btn-block mt-4'
        ></input>
      </form>
      {isUploadedFile ? (
        <h6 className='text-center mt-4'>Successfully uploaded {fileName}</h6>
      ) : null}
      {isUploadedFile ? (
        <button
          type='button'
          className='btn btn-danger'
          onClick={setTimeout(function () {
            setIsButtonClicked(true)
          }, 5000)}
        >
          Create graph
        </button>
      ) : null}

      <CreateChart
        chartName={sensorName}
        isShown={isButtonClicked}
        data={chartData}
      ></CreateChart>
    </Fragment>
  )
}

export default FileUpload
