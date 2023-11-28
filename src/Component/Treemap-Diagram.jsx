import * as d3 from "d3";
import { useEffect, useRef } from "react";


function Treemap (){
    const treeMapRef = useRef()
    useEffect(() => {

        const DATASETS = {
            videogames: {
              TITLE: 'Video Game Sales',
              DESCRIPTION: 'Top 100 Most Sold Video Games Grouped by Platform',
              FILE_PATH:
                'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json'
            },
            movies: {
              TITLE: 'Movie Sales',
              DESCRIPTION: 'Top 100 Highest Grossing Movies Grouped By Genre',
              FILE_PATH:
                'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json'
            },
            kickstarter: {
              TITLE: 'Kickstarter Pledges',
              DESCRIPTION:
                'Top 100 Most Pledged Kickstarter Campaigns Grouped By Category',
              FILE_PATH:
                'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json'
            }
          };
          
          const urlParams = new URLSearchParams(window.location.search);
          const DEFAULT_DATASET = 'videogames';
          const DATASET = DATASETS[urlParams.get('data') || DEFAULT_DATASET];
          // const dataSelector = document.getElementById("data-selector");
          
          // dataSelector.innerHTML = '<a>' + DATASETS[0].TITLE + '</a>' + '/' + '<a>' + DATASETS[1].TITLE + '</a>' + '/' + '<a>' + DATASETS[2].TITLE + '</a>';
          
          document.getElementById('title').innerHTML = DATASET.TITLE;
          document.getElementById('description').innerHTML = DATASET.DESCRIPTION;
          
          // Define body
        
          
          // Define the div for the tooltip
          const tooltip = d3.select(".tooltip")
            .append('div')
            .attr('id', 'tooltip')
            .style('opacity', 0);
          
          const svg = d3.select(treeMapRef.current),
            width = + svg.attr('width'),
            height = + svg.attr('height');
          
          const fader = function (color) {
            return d3.interpolateRgb(color, '#fff')(0.2);
          };
          
          const color = d3.scaleOrdinal().range(
            // Recreate .schemeCategory20
            [
              '#1f77b4',
              '#aec7e8',
              '#ff7f0e',
              '#ffbb78',
              '#2ca02c',
              '#98df8a',
              '#d62728',
              '#ff9896',
              '#9467bd',
              '#c5b0d5',
              '#8c564b',
              '#c49c94',
              '#e377c2',
              '#f7b6d2',
              '#7f7f7f',
              '#c7c7c7',
              '#bcbd22',
              '#dbdb8d',
              '#17becf',
              '#9edae5'
            ].map(fader)
          );
          
          const treemap = d3.treemap().size([width, height]).paddingInner(1);
          
          d3.json(DATASET.FILE_PATH)
            .then(data => {
              const root = d3
                .hierarchy(data)
                .eachBefore(function (d) {
                  d.data.id = (d.parent ? d.parent.data.id + '.' : '') + d.data.name;
                })
                .sum(sumBySize)
                .sort(function (a, b) {
                  return b.height - a.height || b.value - a.value;
                });
          
              treemap(root);
          
              const cell = svg
                .selectAll('g')
                .data(root.leaves())
                .enter()
                .append('g')
                .attr('class', 'group')
                .attr('transform', function (d) {
                  return 'translate(' + d.x0 + ',' + d.y0 + ')';
                });
          
              cell
                .append('rect')
                .attr('id', function (d) {
                  return d.data.id;
                })
                .attr('class', 'tile')
                .attr('width', function (d) {
                  return d.x1 - d.x0;
                })
                .attr('height', function (d) {
                  return d.y1 - d.y0;
                })
                .attr('data-name', function (d) {
                  return d.data.name;
                })
                .attr('data-category', function (d) {
                  return d.data.category;
                })
                .attr('data-value', function (d) {
                  return d.data.value;
                })
                .attr('fill', function (d) {
                  return color(d.data.category);
                })
                .on('mousemove', function (event, d) {
                  tooltip.style('opacity', 0.9);
                  tooltip
                    .html(
                      'Name: ' +
                        d.data.name +
                        '<br>Category: ' +
                        d.data.category +
                        '<br>Value: ' +
                        d.data.value
                    )
                    .attr('data-value', d.data.value)
                    .style('left', event.pageX + 10 + 'px')
                    .style('top', event.pageY - 28 + 'px');
                })
                .on('mouseout', function () {
                  tooltip.style('opacity', 0);
                });
          
              cell
                .append('text')
                .attr('class', 'tile-text')
                .selectAll('tspan')
                .data(function (d) {
                  return d.data.name.split(/(?=[A-Z][^A-Z])/g);
                })
                .enter()
                .append('tspan')
                .attr('x', 4)
                .attr('y', function (d, i) {
                  return 13 + i * 10;
                })
                .text(function (d) {
                  return d;
                });
          
              var categories = root.leaves().map(function (nodes) {
                return nodes.data.category;
              });
              categories = categories.filter(function (category, index, self) {
                return self.indexOf(category) === index;
              });
              const legend = d3.select('#legend');
              const legendWidth = +legend.attr('width');
              const LEGEND_OFFSET = 10;
              const LEGEND_RECT_SIZE = 15;
              const LEGEND_H_SPACING = 150;
              const LEGEND_V_SPACING = 10;
              const LEGEND_TEXT_X_OFFSET = 3;
              const LEGEND_TEXT_Y_OFFSET = -2;
              const legendElemsPerRow = Math.floor(legendWidth / LEGEND_H_SPACING);
          
              const legendElem = legend
                .append('g')
                .attr('transform', 'translate(60,' + LEGEND_OFFSET + ')')
                .selectAll('g')
                .data(categories)
                .enter()
                .append('g')
                .attr('transform', function (d, i) {
                  return (
                    'translate(' +
                    (i % legendElemsPerRow) * LEGEND_H_SPACING +
                    ',' +
                    (Math.floor(i / legendElemsPerRow) * LEGEND_RECT_SIZE +
                      LEGEND_V_SPACING * Math.floor(i / legendElemsPerRow)) +
                    ')'
                  );
                });
          
              legendElem
                .append('rect')
                .attr('width', LEGEND_RECT_SIZE)
                .attr('height', LEGEND_RECT_SIZE)
                .attr('class', 'legend-item')
                .attr('fill', function (d) {
                  return color(d);
                });
          
              legendElem
                .append('text')
                .attr('x', LEGEND_RECT_SIZE + LEGEND_TEXT_X_OFFSET)
                .attr('y', LEGEND_RECT_SIZE + LEGEND_TEXT_Y_OFFSET)
                .text(function (d) {
                  return d;
                });
            })
            .catch(err => console.log(err));
          
          function sumBySize(d) {
            return d.value;
          }
    }, [])
    
return(
<div className="App">
   <div className="tooltip"></div> 
   <div className="treemap-container">
    <a href="?data=videogames"> Video game Data</a> | 
    <a href="?data=movies"> Movies Data</a> |
    <a href="?data=kickstarter"> Kickstarter Data</a> |
   <div id="title"></div>
   <div id="description" style={{paddingBottom: "1.5rem"}}></div>
    <svg className="treemap" ref={treeMapRef} width={1000} height={640}></svg>
    <svg id="legend" width="500" style={{textAlign: "center", display:"block", marginLeft:"auto", marginRight:"auto"}}></svg>
    </div>
    

</div>)
    
}
export default Treemap;