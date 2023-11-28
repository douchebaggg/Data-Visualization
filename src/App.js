import './style/App.css';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Barchart from './Component/Bar-chart';
import { useNavigate, Route, Routes, useLocation } from 'react-router-dom';
import Scatterplot from './Component/Scatterplot';
import Heatmap from './Component/Heat-map';
import Choropleth from './Component/Choropleth';
import Treemap from './Component/Treemap-Diagram';

function App() {
  function samePageLinkNavigation(event) {
    if (
      event.defaultPrevented ||
      event.button !== 0 || // ignore everything but left-click
      event.metaKey ||
      event.ctrlKey ||
      event.altKey ||
      event.shiftKey
    ) {
      return false;
    }
    return true;
  }

  const [pages, setPages] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (event, newValue) => {
    // event.type can be equal to focus with selectionFollowsFocus.
    if (
      event.type !== 'click' ||
      (event.type === 'click' && samePageLinkNavigation(event))
    ) {
      setPages(newValue);
    }
  };

  useEffect(() => {
    // Get the route path and set the initial value for pages
    const currentPath = location.pathname;

    switch (currentPath) {
      case '/scatterplot':
        setPages(1);
        break;
      case '/heatmap':
        setPages(2);
        break;
      case '/choropleth':
        setPages(3);
        break;
      case '/treemap':
        setPages(4);
        break;
      default:
        setPages(0);
        break;
    }
  }, [location.pathname]);

  const barchartButtonClick = () => {
    navigate('/');
  };

  const scatterplotButtonClick = () => {
    navigate('/scatterplot');
  };

  const heatmapButtonClick = () => {
    navigate('/heatmap');
  };

  const choroplethButtonClick = () => {
    navigate('/choropleth');
  };

  const treemapButtonClick = () => {
    navigate('/treemap');
  };

  return (
    <div className="App">
      <Box sx={{ width: '100%', borderBottom: 3, borderColor: 'divider' }}>
        <Tabs
          aria-label="nav tabs example"
          centered
          sx={{ backgroundColor: '#1f1e33' }}
          value={pages}
          onChange={handleChange}
        >
          <Tab label="Bat Chart" onClick={barchartButtonClick} sx={{ color: 'white' }} />
          <Tab label="Scatterplot" onClick={scatterplotButtonClick} sx={{ color: 'white' }} />
          <Tab label="Heat Map" onClick={heatmapButtonClick} sx={{ color: 'white' }} />
          <Tab label="Choropleth Map" onClick={choroplethButtonClick} sx={{ color: 'white' }} />
          <Tab label="Treemap Diagram" onClick={treemapButtonClick} sx={{ color: 'white' }} />
        </Tabs>
      </Box>
      <h1 className="project-title">freeCodeCamp Data Visualization Project</h1>
      <Routes>
        <Route path="/" element={<Barchart />} />
        <Route path="/scatterplot" element={<Scatterplot />} />
        <Route path="/heatmap" element={<Heatmap />} />
        <Route path="/choropleth" element={<Choropleth />} />
        <Route path="/treemap" element={<Treemap />} />
      </Routes>
    </div>
  );
}

export default App;
