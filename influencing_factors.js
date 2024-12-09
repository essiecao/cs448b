(function () {
    const margin = { top: 20, right: 200, bottom: 50, left: 80 };
    const width = 800;
    const height = 600;

    const svg = d3.select("#influencing-factor-visualization")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "1px solid #ccc")
        .style("border-radius", "5px")
        .style("padding", "8px")
        .style("font-size", "12px")
        .style("text-align", "left")
        .style("pointer-events", "none")
        .style("z-index", 10);

    // Load the dataset
    d3.csv("fertility_with_workweek_and_education_data.csv").then(data => {
        // Convert strings to numbers for numerical fields
        data.forEach(d => {
            d["Fertility Rate"] = +d["Fertility Rate"];
            d["Labor force participation rate"] = +d["Labor force participation rate"];
            d["Years of Education"] = +d["Years of Education"];
        });

        // Define color scale for regions
        const colorScale = d3.scaleOrdinal()
            .domain([...new Set(data.map(d => d["World regions according to OWID"]))])
            .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"]);

        // Define opacity and size scales based on Years of Education
        const opacityScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d["Years of Education"])])
            .range([0.01, 0.95]);

        const sizeScale = d3.scaleSqrt()
            .domain([0, d3.max(data, d => d["Years of Education"])])
            .range([1, 12]);

        // Define scales for x (Fertility Rate) and y (Female Labor Force Participation)
        const xScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d["Fertility Rate"])])
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d["Labor force participation rate"])])
            .range([height, 0]);

        // Add grey dashed gridlines
        const gridlinesX = svg.append("g")
            .attr("class", "gridlines")
            .selectAll("line")
            .data(xScale.ticks())
            .enter()
            .append("line")
            .attr("x1", d => xScale(d))
            .attr("x2", d => xScale(d))
            .attr("y1", 0)
            .attr("y2", height)
            .attr("stroke", "grey")
            .attr("stroke-width", 0.5)
            .attr("stroke-dasharray", "4 4");

        const gridlinesY = svg.append("g")
            .attr("class", "gridlines")
            .selectAll("line")
            .data(yScale.ticks())
            .enter()
            .append("line")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", d => yScale(d))
            .attr("y2", d => yScale(d))
            .attr("stroke", "grey")
            .attr("stroke-width", 0.5)
            .attr("stroke-dasharray", "4 4");

        // Add Axes
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .style("font-size", "14px"); // Enlarged font size for X-axis labels

        svg.append("g")
            .call(d3.axisLeft(yScale))
            .selectAll("text")
            .style("font-size", "14px"); // Enlarged font size for Y-axis labels

        // Add axis labels
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 10)
            .attr("text-anchor", "middle")
            .style("font-size", "16px") // Enlarged font size for axis label
            .text("Fertility Rate");

        svg.append("text")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 40)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .style("font-size", "16px") // Enlarged font size for axis label
            .text("Female Labor Force Rate");

        // Draw scatterplot points
        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d["Fertility Rate"]))
            .attr("cy", d => yScale(d["Labor force participation rate"]))
            .attr("r", d => sizeScale(d["Years of Education"]))
            .attr("fill", d => colorScale(d["World regions according to OWID"]))
            .attr("opacity", d => opacityScale(d["Years of Education"]))
            .on("mouseover", (event, d) => {
                tooltip.style("opacity", 1)
                    .html(`Country: ${d["Entity"]}<br>
                           Fertility Rate: ${d["Fertility Rate"]}<br>
                           Female Labor Force Rate: ${d["Labor force participation rate"]}<br>
                           Years of Education: ${d["Years of Education"]}`)
                    .style("left", `${event.pageX + 15}px`)
                    .style("top", `${event.pageY}px`);
            })
            .on("mousemove", function (event) {
                tooltip.style("left", `${event.pageX + 15}px`)
                    .style("top", `${event.pageY}px`);
            })
            .on("mouseout", () => tooltip.style("opacity", 0));

        // Add legend for regions
        const legend = svg.append("g")
            .attr("transform", `translate(${width + 20}, 20)`);

        const regions = colorScale.domain();
        regions.forEach((region, i) => {
            legend.append("circle")
                .attr("cx", 10)
                .attr("cy", i * 20)
                .attr("r", 7)
                .attr("fill", colorScale(region));

            legend.append("text")
                .attr("x", 25)
                .attr("y", i * 20 + 5)
                .text(region)
                .style("alignment-baseline", "middle");
        });
    });
})();
