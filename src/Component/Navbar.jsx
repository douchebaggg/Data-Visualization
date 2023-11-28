import React, { useState,} from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Barchart from './Bar-chart';
import Scatterplot from './Scatterplot';
import Heatmap from './Heat-map';
import Choropleth from './Choropleth';
import Treemap from './Treemap-Diagram';

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

function LinkTab(props) {
  const { href, ...otherProps } = props;
  const navigate = useNavigate();
  const handleClick = (event) => {
    if (samePageLinkNavigation(event)) {
      event.preventDefault();
      navigate(href);
    }
  };

  return (
    <Tab component="a" href={href} onClick={handleClick} {...otherProps} />
  );
}

export default function NavTabs() {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    // event.type can be equal to focus with selectionFollowsFocus.
    if (
      event.type !== 'click' ||
      (event.type === 'click' && samePageLinkNavigation(event))
    ) {
      setValue(newValue);
    }
  };
 
  return (
    <Box >
      <Tabs value={value} onChange={handleChange} centered>
        <LinkTab label="Barchart" href="/" sx={{color:"white"}} />
        <LinkTab label="Scatterplot" href="/scatterplot" sx={{color:"white"}}  />
        <LinkTab label="Heat Map" href="/heatmap" sx={{color:"white"}} />
        <LinkTab label="Choropleth" href="/choropleth" sx={{color:"white"}} />
        <LinkTab label="Tree Map" href="/treemap" sx={{color:"white"}} />
      </Tabs>

      <Routes>
        <Route path="/" element={<Barchart />} onChange={handleChange} />
        <Route path="/scatterplot" element={<Scatterplot />} onChange={handleChange} />
        <Route path="/heatmap" element={<Heatmap />} onChange={handleChange} />
        <Route path="/choropleth" element={<Choropleth />} onChange={handleChange} />
        <Route path="/treemap" element={<Treemap />} onChange={handleChange} />
      </Routes>
    </Box>
  );
}
