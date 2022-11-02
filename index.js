// constants
const h = 500;
const padding = 40;
const barWidth = 3;
const barMargin = 1;
const barColor = "steelblue";

// data request
const req = new XMLHttpRequest();
req.open(
  "GET",
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json",
  true
);
req.send();
req.onload = function () {
  const json = JSON.parse(req.responseText);
  drawBar(json);
};

// page function
function drawBar(json) {
  const title = d3
    .select("#info")
    .append("h1")
    .text(json.name)
    .attr("class", "title")
    .attr("id", "title");
  const source = d3
    .select("#info")
    .append("p")
    .text(json.source_name)
    .attr("class", "source");
  drawBarChart(json.data);
}

// chart function
function drawBarChart(dataset) {
  // svg
  const svg = d3
    .select("#diagram")
    .append("svg")
    .attr("width", barWidth * dataset.length + 2 * padding)
    .attr("height", h);

  // scales
  const xScale = d3
    .scaleTime()
    .domain([
      d3.min(dataset, (d) => new Date(d[0])),
      d3.max(dataset, (d) => new Date(d[0])),
    ])
    .range([padding, barWidth * dataset.length + padding]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([h - 2 * padding, 0]);

  const xTicks = xScale.ticks();
  const yTicks = yScale.ticks();

  // axis
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
  svg
    .append("g")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis)
    .attr("id", "x-axis");
  svg
    .append("g")
    .attr("transform", "translate(" +  padding + "," + padding + ")")
    .call(yAxis)
    .attr("id", "y-axis");

  //tooltip
  const tooltip = d3.select("#diagram")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0)

  const mouseover = function(d) {
    tooltip
      .style("opacity", 1)
  }
  const mousemove = function(d) {
    console.log(d);
    const date = d3.select(this).attr('data-date');
    const gdp = d3.select(this).attr('data-gdp');
    tooltip
      .html(`
        <p id="tooltip-date">${date}</p>
        <p id="tooltip-gdp">$${gdp} Billion</p>
      `)
      .style("left", (d.layerX + 20) + "px")
      .style("top", (d.layerY) + "px")
  }
  const mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
  }

    
  // chart
  const group = svg
    .selectAll("g")
    .data(dataset, (d) => d)
    .enter()
    .append("g")
    .attr("transform", (d, i) => {
      return `translate(${i * barWidth + padding}, 0)`;
    })
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);
  group
    .append("rect")
    .attr("x", 0)
    .attr("y", (d) => padding + yScale(d[1]))
    .attr("width", barWidth - barMargin)
    .attr("height", (d) => h - 2 * padding - yScale(d[1]))
    .attr("class", "bar")
}
