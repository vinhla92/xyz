import _xyz from '../_xyz.mjs';

import d3_selection from "d3-selection";
import d3_scale from "d3-scale";
import d3_format from "d3-format";
import d3_array from "d3-array";
import d3_axis from "d3-axis";

export function bar_chart(layer, chart){
    
    let week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    
    let data = _xyz.ws.locales[_xyz.locale].layers[layer].charts[chart];
    
    if(!data[0] || !data[0].y) return;
    
    let div = _xyz.utils.createElement('div');
    
    let td = _xyz.utils.createElement('td', {
        colSpan: "2"
    });
    
    let tr = _xyz.utils.createElement('tr');
    
    // Define the div for the tooltip
    let tltp = d3_selection.select(div).append("div")	
    .attr("class", "chart-tooltip")				
    .style("opacity", 0)
    .style("width", "auto");
    
    // set the dimensions of the canvas
    let margin = {top: 30, right: 20, bottom: 20, left: 35},
        width = 290 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;
    
    // set the ranges
    let x = d3_scale.scaleBand().range([0, width]).round(0.05);
    let y = d3_scale.scaleLinear().range([height, 0]);
    
    // define the axis
    let xAxis = d3_axis.axisBottom(x);
    let yAxis = d3_axis.axisLeft().scale(y);
    
    // add the SVG element
    let svg = d3_selection.select(div).append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    svg.append("text")
        .attr("x", margin.left)             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "12px") 
        .style("text-decoration", "underline")  
        .text(chart);
    
    // scale the range of the data
    x.domain(data.map(function(d){
        return d.x;
    }));
    y.domain([0, d3_array.max(data, function(d){
        return d.y ? d.y : 0; 
    })]);
    
    // append the rectangles for the bar chart d3 v4
    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d){
            return x(d.x);
        })
        .attr("width", x.bandwidth())
        .attr("y", function(d){
            return y(d.y);
        })
        .attr("height", function (d) {
            return height - y(d.y);
        })
        // .on("mouseover", function (d) {
        //     tltp.transition()
        //         .duration(200)
        //         .style("opacity", .9);

        //     tltp.html(d.y.toLocaleString('en-GB'))
        //         .style("left", (d3.event.pageX - 18) + "px")
        //         .style("top", (d3.event.pageY - 20) + "px");
        // })
        .on("mouseout", function (d) {
            tltp.transition()
                .duration(500)
                .style("opacity", 0);
    });

    let formatValue = d3_format.format(".2s");
    
    // add the x Axis
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3_axis.axisBottom(x).tickFormat(function(d, i){
        return data.length == week.length ? week[d] : d;
    }));
    
    
    // text label for the x axis
    svg.append("text")             
      .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")
      .style("text-anchor", "middle");
    
      // add the y Axis
    svg.append("g").call(d3_axis.axisLeft(y).tickFormat(function(d, i){
        if(d > 999) d = formatValue(d);
        if(d < 1000) d = (d == Math.floor(d)) ? d : "";
        return d;
    }));
    
     // text label for the y axis
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle");
    
    td.appendChild(div);
    tr.appendChild(td);
    return tr;
}