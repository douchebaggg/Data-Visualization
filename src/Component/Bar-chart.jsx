import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import * as d3 from 'd3';

function Barchart() {
    const chartRef = useRef(); 
    useEffect(() => {
      // Fetch data from your API
      var svg = d3.select(chartRef.current)
      const fetchData = async () => {
        try {
          const response = await axios.get('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'); // Replace with your actual API endpoint
          const gdpData = response.data.data; // Assuming your data is in the 'data' property
          loadGraph(svg,gdpData)
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
      const loadGraph = (svg, gdpDataset) => {
        const padding = 30;
        const width = 800;
        const height = 400;
        const barwidth = width / 275;
    
        const xScale = d3
          .scaleTime()
          .domain([d3.min(gdpDataset, (d) => new Date(d[0])), d3.max(gdpDataset, (d) => new Date(d[0]))])
          .range([padding, width + padding - 10]);
    
        const yScale = d3
          .scaleLinear()
          .domain([0, d3.max(gdpDataset, (d) => d[1])])
          .range([height - padding, padding]);
          const tooltip = d3.select('.tooltip').append('div').attr('id', 'tooltip');
          svg
          .selectAll('rect')
          .data(gdpDataset)
          .enter()
          .append('rect')
          .attr('x', (d, i) => padding + xScale(new Date(d[0])))
          .attr('y', (d) => yScale(d[1]))
          .attr('width', barwidth) 
          .attr('height', (d) => height - padding - yScale(d[1]))
          .attr('fill', '#36ACFA')
          .attr('class', 'bar')
          .attr('data-date', (d) => d[0])
          .attr('data-gdp', (d) => d[1])
          .on('mouseover', function (event, d) {
            // Show tooltip on mouseover
            tooltip.transition().duration(200).style('opacity', 0.9);
            tooltip
             .html(`<strong>Date:</strong> ${d[0]}<br/><strong>GDP:</strong> $${d[1]} Billion`)
              
              .attr('data-date', d[0])
              .style('left', event.pageX + 'px')
              .style('top', event.pageY - 28 + 'px');
          })
          .on('mouseout', function () {
            // Hide tooltip on mouseout
            tooltip.transition().duration(200).style('opacity', 0);
          });
    
        const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%Y'));
        const yAxis = d3.axisLeft(yScale);
    
        svg
          .append('g')
          .attr('id', 'x-axis')
          .attr('transform', `translate(${padding}, ${height - padding})`)
          .call(xAxis);
    
        svg
        .append('g')
        .attr('id', 'y-axis')
        .attr('transform', `translate(${2 * padding},0)`)
        .call(yAxis); 

        }

    }, []);
   
    return (
      
      <div className="App">
        <div className='tooltip'> </div>
        <div className="data-holder">
        <h1 className="barchart" id="title">
          United States GDP
        </h1>
        <svg ref={chartRef} width={900} height={460}>
        </svg>
        </div>
      </div>
    );
  }
  

export default Barchart;