(function () {
    // Set the dimensions of the graph
    const graphWidth = 900; // Increased width
    const graphHeight = 600; // Increased height

    // Create an SVG container
    const svg = d3.select("#chart0")
        .append("svg")
        .attr("width", graphWidth)
        .attr("height", graphHeight);

    // Load the processed CSV data
    d3.csv("fertility_with_workweek_and_education_data.csv").then(data => {
        // Parse the data
        data.forEach(d => {
            d.YearsOfEducation = +d["Years of Education"]; // Convert Years of Education to numeric
            d.FertilityRate = +d["Fertility Rate"];        // Convert Fertility Rate to numeric
        });

        // Define scales
        const bubbleSizeScale = d3.scaleSqrt()
            .domain(d3.extent(data, d => d.YearsOfEducation))
            .range([2, 40]); // Bubble size range based on years of education

        const bubbleOpacityScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d.FertilityRate))
            .range([0.2, 1]); // Opacity based on fertility rate

        // Add a force simulation to prevent overlap
        const simulation = d3.forceSimulation(data)
            .force("x", d3.forceX(graphWidth / 2).strength(0.2)) // Center x-position, increased strength
            .force("y", d3.forceY(graphHeight / 2).strength(0.2)) // Center y-position, increased strength
            .force("collide", d3.forceCollide(d => bubbleSizeScale(d.YearsOfEducation) + 3)) // Ensure no overlap, adjusted padding
            .stop();

        // Run the simulation for a fixed number of iterations to position the bubbles
        for (let i = 0; i < 300; i++) simulation.tick();

        // Assign calculated positions back to data
        data.forEach(d => {
            d.x = Math.max(bubbleSizeScale(d.YearsOfEducation), Math.min(graphWidth - bubbleSizeScale(d.YearsOfEducation), d.x));
            d.y = Math.max(bubbleSizeScale(d.YearsOfEducation), Math.min(graphHeight - bubbleSizeScale(d.YearsOfEducation), d.y));
        });

        // Add bubbles to the SVG
        const bubbles = svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => d.x) // x-position determined by the simulation
            .attr("cy", d => d.y) // y-position determined by the simulation
            .attr("r", d => bubbleSizeScale(d.YearsOfEducation)) // Bubble size based on years of education
            .attr("fill", "purple")
            .attr("opacity", d => bubbleOpacityScale(d.FertilityRate));

        // Add hover tooltip
        const tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip-gdp")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("background-color", "white")
            .style("border", "1px solid black")
            .style("border-radius", "5px")
            .style("padding", "5px")
            .style("font-size", "14px") // Adjust font size
            .style("max-width", "200px") // Limit tooltip width
            .style("box-shadow", "0px 4px 6px rgba(0, 0, 0, 0.1)"); // Add subtle shadow

        bubbles.on("mouseover", function (event, d) {
            tooltip.style("opacity", 1)
                .html(`
                    <strong>${d.Entity}</strong><br>
                    Years of Education: ${d.YearsOfEducation.toFixed(1)}<br>
                    Fertility Rate: ${d.FertilityRate.toFixed(2)}
                `)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mousemove", function (event) {
            tooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function () {
            tooltip.style("opacity", 0);
        });

    }).catch(error => console.error("Error loading data:", error));
})();
