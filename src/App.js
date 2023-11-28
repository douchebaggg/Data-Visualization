import './style/App.css';
import { Button } from '@mui/material';
import Barchart from './Component/Bar-chart'
import { BrowserRouter as Router, Navigate, Route, Routes, Link } from 'react-router-dom';
import Scatterplot from './Component/Scatterplot';
import { useState } from 'react';

function App() {
  const [ButtonClick, setButtonClick] = useState(false);
  
  const nextButtonClick = () =>{
    setButtonClick(true);
  }
  const prevButtonClick = () =>{
    setButtonClick(false)
  }

  return (
     <div className="App">
      <h1 className="project-title">freeCodeCamp Data Visualization Project</h1>
          {/* Conditionally render Barchart or Scatterplot based on ButtonClick state */}
          {ButtonClick ? <Scatterplot /> : <Barchart />}
      <Router>
        {/* Use Link to navigate to the "/test" route */}
        <Link className="link" to="/test"> <Button id='btn' onClick={nextButtonClick}>Next</Button> </Link>
        <Link className="link" to="/"> <Button id={ ButtonClick ? "btn" : "btn-off"} onClick={prevButtonClick} >Prev</Button> </Link>
        
        <Routes>
          <Route path="/" element={<Home />} />
         
          {/* If any route mismatches, redirect to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}
function Home() {
  return <div>Home Component</div>;
}
// Create a Home component to render when path is "/"
export default App;
