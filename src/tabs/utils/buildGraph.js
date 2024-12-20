export const buildGraphData = (schemas) => {
  const nodes = [];
  const links = [];
  const rootNode = { id: 0, name: "Schema" };
  nodes.push(rootNode);

  let nodeId = 1;

  const traverse = (data, parentId = 0, linkName = "") => {
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
  return { nodes, links };
};
