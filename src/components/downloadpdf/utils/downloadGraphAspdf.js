export const downloadGraphAsPdf = (doc, graphRef, startPosition, title) => {
  // Get the SVG element and convert it to an image URL (PNG)
  const svgElement = graphRef.current.querySelector("svg");
  if (!svgElement) {
    doc.save(`Digispot.AI SEOAudit report-${title || "Website"}.pdf`);
    return;
  }

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
    link.href = canvas.toDataURL("image/png");
    const maxWidth = 180;
    const maxHeight = 200;
    let imgWidth = width;
    let imgHeight = height;
    const aspectRatio = imgWidth / imgHeight;

    if (imgWidth > maxWidth || imgHeight > maxHeight) {
      if (imgWidth / maxWidth > imgHeight / maxHeight) {
        imgWidth = maxWidth;
        imgHeight = maxWidth / aspectRatio;
      } else {
        imgHeight = maxHeight;
        imgWidth = maxHeight * aspectRatio;
      }
    }

    const pageWidth = doc.internal.pageSize.width;
    const x = (pageWidth - imgWidth) / 2;
    const pageHeight = doc.internal.pageSize.height;

    if (startPosition + imgHeight + 30 > pageHeight) {
      doc.addPage();
      startPosition = 30;
    } else {
      startPosition += 20;
    }

    doc.setFontSize(14);
    doc.text("Schema Structure", 105, startPosition - 20, { align: "center" });
    doc.addImage(link.href, "PNG", x, startPosition + 10, imgWidth, imgHeight);
    console.log("Added Image in Doc.");

    URL.revokeObjectURL(url);
    doc.save(`Digispot.AI SEOAudit report-${title || "Website"}.pdf`);
  };

  img.onerror = () => {
    console.error("Error occurred while loading the image for download.");
  };

  img.src = url;
};
