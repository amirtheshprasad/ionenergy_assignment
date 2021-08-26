import "./App.css"
import FileUpload from "./Components/FileUpload"

function App() {
  return (
    <div className='container mt-4'>
      <h4 className='display-4 text-center mb-4'>
        Temperature vs Time graph 🌡⏲
      </h4>
      <FileUpload></FileUpload>
    </div>
  )
}

export default App
