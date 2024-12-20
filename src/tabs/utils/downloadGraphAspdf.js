import { jsPDF } from "jspdf";
import { downloadGraphAsPng } from "./downloadGraphAsPng";

// Function to download the graph as a PNG and create a PDF with it
export const downloadGraphAsPdf = (graphRef) => {
  // First, download the graph as a PNG image
  downloadGraphAsPng(graphRef);

  // Create a new jsPDF instance for the PDF document
  const doc = new jsPDF();

  // Get the SVG element and convert it to an image URL (PNG)
  const svgElement = graphRef.current.querySelector("svg");
  if (!svgElement) return;

  const imageUrl = svgElement.toDataURL("image/png");

  // Add the image to the PDF document (you can adjust the coordinates and dimensions)
  doc.addImage(imageUrl, "PNG", 10, 10, 180, 180); // Adjust the image size and position here
  doc.text("Schema Graph", 10, 200); // Add a title or any text if required

  // Save the PDF with the desired filename
  doc.save("schema-graph.pdf");
};
