// import { jsPDF } from "jspdf";
export const downloadGraphAsPng = (graphRef) => {
  // const doc = new jsPDF();

  // Get the SVG element and convert it to an image URL (PNG)
  const svgElement = graphRef.current.querySelector("svg");
  if (!svgElement) return;

  // const imageUrl = svgElement.toDataURL("image/png");

  // Add the image to the PDF document (you can adjust the coordinates and dimensions)

  // const svgElement = graphRef.current.querySelector("svg");
  // if (!svgElement) return;

  const clonedSvg = svgElement.cloneNode(true);
  const bbox = svgElement.getBBox();
  const width = bbox.width;
  const height = bbox.height;

  clonedSvg.setAttribute("viewBox", `${bbox.x} ${bbox.y} ${width} ${height}`);
  clonedSvg.setAttribute("width", width);
  clonedSvg.setAttribute("height", height);

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(clonedSvg);
  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const img = new Image();

  img.onload = () => {
    const canvas = document.createElement("canvas");
    const scaleFactor = 4;
    canvas.width = width * scaleFactor;
    canvas.height = height * scaleFactor;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, width * scaleFactor, height * scaleFactor);

    const link = document.createElement("a");
    link.download = "schema-graph.png";
    link.href = canvas.toDataURL("image/png");
    link.click();

    URL.revokeObjectURL(url);
    // doc.text("Schema Structure", 105, 10, { align: "center" });
    // doc.addImage(link.href, "PNG", 30, 70, 180, 180); // Adjust the image size and position here

    // Save the PDF with the desired filename
    // doc.save("schema-graph.pdf");
  };

  img.onerror = () => {
    console.error("Error occurred while loading the image for download.");
  };

  img.src = url;
};
