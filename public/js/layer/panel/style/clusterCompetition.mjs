if (layer.style.theme.competitors) {
      
  let competitors = Object.keys(layer.style.theme.competitors),
    n = competitors.length,
    i = 0;
      
  competitors.reverse().forEach(comp => {
      
    svg.append('circle')
      .attr('cx', 20)
      .attr('cy', y)
      .attr('r', 20 - (i + 1) * 20 / (n + 1))
      .style('fill', layer.style.theme.competitors[comp].colour);
      
    i++;
  });
      
  i = 0;
      
  competitors.reverse().forEach(comp => {
      
    svg.append('circle')
      .attr('cx', 20)
      .attr('cy', y + 35 + (i * 20))
      .attr('r', 8)
      .style('fill', layer.style.theme.competitors[comp].colour);
      
    svg.append('text')
      .attr('x', 45)
      .attr('y', y + 35 + (i * 20))
      .attr('alignment-baseline', 'central')
      .style('font-size', '12px')
      .text(layer.style.theme.competitors[comp].label);
      
    i++;
  });
      
  y += 15 + (n * 20);
      
} else { y += 15; }
      
// Set height of the svg element.
svg.attr('height', y += 10);