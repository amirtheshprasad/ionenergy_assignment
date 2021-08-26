import React, { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import moment from "moment"

const CreateChart = ({ data, isShown, chartName }) => {
  const [chartData, setChartData] = useState({})

  useEffect(() => {
    async function fetchData() {
      if (isShown) {
        console.log(data.labels)
        const xAxisLabels = await data.labels.map((label) => {
          return moment(label).format("DD/MM/YYYY")
        })

        const yAxisData = await data.datasets.map((dataPoint) => {
          return dataPoint
        })
        setChartData({
          labels: xAxisLabels,
          datasets: [
            {
              label: "temperature",
              data: yAxisData,
              fill: false,
              backgroundColor: "rgb(255, 99, 132)",
              borderColor: "rgba(255, 99, 132, 0.2)",
            },
          ],
        })
      }
    }
    fetchData()
  }, [data])

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return (
    <div>
      {isShown ? (
        <div>
          <h2 className='mt-5 mb-5'>{chartName} line chart</h2>

          <div>
            <div style={{ display: "flex" }}>
              <p
                style={{
                  transform: "rotate(-90deg)",
                  marginLeft: "0",
                  marginTop: "25%",
                  height: "20px",
                }}
              >
                Temperature
              </p>

              <Line data={chartData} options={options} />
            </div>
            <p style={{ marginTop: "30px", marginLeft: "50%" }}>
              Date recorded (dd/mm/yyyy format)
            </p>
            <div className='mb-8'></div>{" "}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default CreateChart
