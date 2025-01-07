import * as d3 from "d3";
import { GraphNode, GraphLink } from "../types/seo";

export const renderGraph = (
  graphRef: React.RefObject<HTMLDivElement>,
  { nodes, links }: { nodes: GraphNode[]; links: GraphLink[] },
  linkDistance: number,
  fontSize: number,
  nodeSize: number,
  isDragEnabled: boolean,
  simulationRef: React.MutableRefObject<any>,
  width: number,
  height: number
) => {
  d3.select(graphRef.current).selectAll("*").remove();
  const svg = d3
    .select(graphRef.current)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(
      d3.zoom<SVGSVGElement, unknown>()
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
    .attr("refX", nodeSize + 12)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "#aaa");

  simulationRef.current = d3
    .forceSimulation<GraphNode>(nodes)
    .force(
      "link",
      d3
        .forceLink<GraphNode, GraphLink>(links)
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
    .attr("marker-end", "url(#arrow)")

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
    .attr("fill", (d) => d3.schemeCategory10[d.id % 10]);

  if (isDragEnabled) {
    node.call(
      d3.drag<SVGCircleElement, GraphNode>().on("start", dragstarted).on("drag", dragged).on("end", dragended) as any
    );
  }

  const label = graphGroup
    .append("g")
    .selectAll("text")
    .data(nodes)
    .join("text")
    .attr("x", 6)
    .attr("y", 3)
    .text((d) => d.name)
    .style("font-size", `${fontSize}px`);

  simulationRef.current.updateFontSize = (newSize: number) => {
    label.style("font-size", `${newSize}px`);
    linkLabel.style("font-size", `${newSize}px`);
  };

  simulationRef.current.updateNodeSize = (newSize: number) => {
    node.attr("r", newSize);
  };

  simulationRef.current.updateLinkDistance = (newDistance: number) => {
    simulationRef.current
      .force("link")
      .distance(newDistance);
    simulationRef.current.alpha(0.3).restart();
  };

  simulationRef.current.toggleDrag = (enabled: boolean) => {
    if (enabled) {
      node.call(
        d3.drag<SVGCircleElement, GraphNode>().on("start", dragstarted).on("drag", dragged).on("end", dragended) as any
      );
    } else {
      node.on(".drag", null);
    }
  };

  simulationRef.current.on("tick", () => {
    link
      .attr("x1", (d) => Number((d.source as GraphNode).x) || 0)
      .attr("y1", (d) => Number((d.source as GraphNode).y) || 0)
      .attr("x2", (d) => Number((d.target as GraphNode).x) || 0)
      .attr("y2", (d) => Number((d.target as GraphNode).y) || 0);

    linkLabel
      .attr("x", (d) => (Number((d.source as GraphNode).x) + Number((d.target as GraphNode).x)) / 2)
      .attr("y", (d) => (Number((d.source as GraphNode).y) + Number((d.target as GraphNode).y)) / 2);

    node.attr("cx", (d) => Number(d.x) || 0).attr("cy", (d) => Number(d.y) || 0);
    label.attr("x", (d) => Number(d.x) || 0).attr("y", (d) => Number(d.y) || 0);
  });

  function dragstarted(event: d3.D3DragEvent<SVGCircleElement, GraphNode, unknown>) {
    if (!event.active) simulationRef.current.alphaTarget(0.3).restart();
    const node = event.subject as GraphNode;
    node.fx = node.x;
    node.fy = node.y;
  }

  function dragged(event: d3.D3DragEvent<SVGCircleElement, GraphNode, unknown>) {
    const node = event.subject as GraphNode;
    node.fx = event.x;
    node.fy = event.y;
  }

  function dragended(event: d3.D3DragEvent<SVGCircleElement, GraphNode, unknown>) {
    if (!event.active) simulationRef.current.alphaTarget(0);
    const node = event.subject as GraphNode;
    node.fx = null;
    node.fy = null;
  }
}; 