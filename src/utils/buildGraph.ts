import { GraphNode, GraphLink } from "../types/seo";

export const buildGraphData = (schemas: any[]): { nodes: GraphNode[]; links: GraphLink[] } => {
  const nodes: GraphNode[] = [];
  const links: { source: number; target: number; linkName: string }[] = [];
  const rootNode = { id: 0, name: "Schema" };
  nodes.push(rootNode);

  let nodeId = 1;

  const traverse = (data: any, parentId = 0, linkName = "") => {
    if (typeof data === "object" && data !== null) {
      const hasType = data["@type"];
      const currentId = hasType ? nodeId++ : parentId;
      if (hasType) {
        nodes.push({
          id: currentId,
          name: data["@type"] || "Object",
        });

        links.push({
          source: parentId,
          target: currentId,
          linkName: linkName,
        });
      }

      Object.entries(data).forEach(([key, value]) => {
        if (key !== "@type") {
          traverse(value, currentId, key);
        }
      });
    }
  };

  schemas.forEach((schema) => traverse(schema));
  
  // Convert numeric source/target to node references
  const graphLinks = links.map(link => ({
    source: nodes.find(n => n.id === link.source)!,
    target: nodes.find(n => n.id === link.target)!,
    linkName: link.linkName
  }));

  return { nodes, links: graphLinks };
}; 