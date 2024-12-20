import * as d3 from "d3";
export const renderGraph = (
  graphRef,
  { nodes, links },
  linkDistance,
  fontSize,
  nodeSize,
  isDragEnabled,
  simulationRef,
  width,
  height
) => {
  d3.select(graphRef.current).selectAll("*").remove();
  const svg = d3
    .select(graphRef.current)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(
      d3
        .zoom()
        .scaleExtent([0.01, 5])
        .on("zoom", (event) => {
          graphGroup.attr("transform", event.transform);
        })
    );

  const graphGroup = svg.append("g");

  svg
    .append("defs")
    .append("marker")
    .attr("id", "arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 25)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "#aaa");

  simulationRef.current = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => d.id)
        .distance(linkDistance)
    )
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(width / 2, height / 2));

  const link = graphGroup
    .append("g")
    .attr("stroke", "#aaa")
    .attr("stroke-width", 1)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("marker-end", "url(#arrow)");

  const linkLabel = graphGroup
    .append("g")
    .selectAll("text")
    .data(links)
    .join("text")
    .attr("class", "link-label")
    .text((d) => d.linkName || "")
    .style("font-size", `${fontSize}px`)
    .style("fill", "#555");

  const node = graphGroup
    .append("g")
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", nodeSize)
    .attr("fill", (d) => d3.schemeCategory10[d.id % 10])
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

  const label = graphGroup
    .append("g")
    .selectAll("text")
    .data(nodes)
    .join("text")
    .attr("x", 6)
    .attr("y", 3)
    .text((d) => d.name)
    .style("font-size", `${fontSize}px`);

  simulationRef.current.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    linkLabel
      .attr("x", (d) => (d.source.x + d.target.x) / 2)
      .attr("y", (d) => (d.source.y + d.target.y) / 2);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    label.attr("x", (d) => d.x).attr("y", (d) => d.y);
  });

  function dragstarted(event) {
    if (!event.active) simulationRef.current.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event) {
    if (!event.active) simulationRef.current.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }
};
