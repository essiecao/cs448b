(function () {
    // Set dimensions
    const width = 800;
    const height = 800;
    const margin = { top: 20, right: 50, bottom: 50, left: 30 };
    const lineMargin = 20;

    const svg = d3.select("#fertility-visualization svg")
        .attr("width", width)
        .attr("height", height + 30);

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Add a title below the graph
    svg.append("text")
        .attr("x", width / 2) // Center the title horizontally
        .attr("y", height + 5) // Position below the graph
        .attr("text-anchor", "middle") // Align text to the center
        .text("Relative Change in Women Fertility Rates (1950-2023)")
        .attr("font-size", "18px")
        .attr("fill", "#333");

    // Tooltip
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

    // Define ranges
    const ranges = [0, -25, -50, -75, -100];
    const rangeHeight = chartHeight / (ranges.length - 1);

    // Define a seeded random function
    let seed = 42; // Fixed seed
    function seededRandom() {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }

    // Load the data
    d3.csv("fertility_rate_relative_change.csv").then(data => {
        // Parse data
        data.forEach(d => {
            d["Relative Change"] = +d["Relative Change"];
        });

        // Define scales
        const fixedRadius = 7;

        const opacityScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => Math.abs(d["Relative Change"]))])
            .range([0.2, 1]);

        // Track placed circles to avoid overlap
        const placedCircles = [];

        // Helper function to check for overlap
        function checkOverlap(newCircle) {
            return placedCircles.some(existing => {
                const dx = newCircle.x - existing.x;
                const dy = newCircle.y - existing.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                return distance < 2 * fixedRadius; // Ensure no overlap
            });
        }

        // Draw horizontal lines for ranges
        ranges.forEach((range, i) => {
            const y = i * rangeHeight;
            chart.append("line")
                .attr("x1", 30)
                .attr("x2", chartWidth)
                .attr("y1", y)
                .attr("y2", y)
                .attr("stroke", "grey")
                .attr("stroke-width", 1)
                .attr("stroke-dasharray", "4 2");

            // Add labels for each range
            chart.append("text")
                .attr("x", 20)
                .attr("y", y)
                .attr("dy", "0.35em")
                .attr("text-anchor", "end")
                .text(`${range}%`)
                .attr("font-size", "16px")
                .attr("fill", "#333");
        });

        // Draw circles for countries within the ranges
        ranges.forEach((range, i) => {
            if (i === ranges.length - 1) return;

            const nextRange = ranges[i + 1];

            // Filter countries in this range
            const countriesInRange = data.filter(d => d["Relative Change"] <= range && d["Relative Change"] > nextRange);

            // Place circles randomly within the range space without overlap
            countriesInRange.forEach(country => {
                let position;

                // Try placing the circle without overlap
                do {
                    const randomX = seededRandom() * chartWidth;
                    const randomY = yRangeRandom(i, rangeHeight, lineMargin);
                    position = { x: randomX, y: randomY };
                } while (checkOverlap(position));

                // Add the circle
                const circle = chart.append("circle")
                    .attr("cx", position.x)
                    .attr("cy", position.y)
                    .attr("r", fixedRadius)
                    .attr("fill", "rgb(35, 159, 138)")
                    .attr("opacity", opacityScale(Math.abs(country["Relative Change"])))
                    .attr("stroke", "rgb(35, 159, 138)")
                    .attr("stroke-width", 1);

                // Tooltip and hover effects
                circle
                    .on("mouseover", function (event, d) {
                        d3.select(this)
                            .attr("stroke", "black")
                            .attr("stroke-width", 3);

                        tooltip.transition()
                            .duration(200)
                            .style("opacity", 1);

                        tooltip.html(
                            `<strong>Country:</strong> ${country["Country"]}<br>` +
                            `<strong>Relative Change:</strong> ${country["Relative Change"].toFixed(2)}%`
                        )
                            .style("left", `${event.pageX + 10}px`) // Position tooltip relative to mouse X
                            .style("top", `${event.pageY - 50}px`); // Position tooltip relative to mouse Y
                    })
                    .on("mouseout", function () {
                        d3.select(this)
                            .attr("stroke", "rgb(35, 159, 138)")
                            .attr("stroke-width", 1);

                        tooltip.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });

                // Add to placed circles
                placedCircles.push(position);
            });
        });

        // Function to calculate random y position within a range
        function yRangeRandom(rangeIndex, rangeHeight, lineMargin) {
            const top = rangeIndex * rangeHeight + lineMargin;
            const bottom = (rangeIndex + 1) * rangeHeight - lineMargin;
            return top + seededRandom() * (bottom - top);
        }
    });
})();
