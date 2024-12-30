import { borderAndFooter } from "./borderandfooter";
export const addMetaLinksDetails = (doc, info, startPosition, pageNumber) => {
  const recommendations = [];
  const metaLinks = [
    { label: "URL", value: info.url },
    { label: "Title", value: info.title },
    { label: "Description", value: info.description },
    { label: "Canonical", value: info.canonical },
    { label: "Language", value: info.lang },
    { label: "Robots Meta", value: info.robots },
    { label: "X-Robots Meta", value: info.xRobots },
  ];

  pageNumber = borderAndFooter(doc, pageNumber);
  doc.setFontSize(16);
  doc.setTextColor(0, 123, 255);
  doc.setFont(undefined, "bold");
  doc.text("OnPage SEO Analysis", 105, 20, { align: "center" });

  doc.setFontSize(14);
  doc.setFont(undefined, "normal");
  doc.text("Meta Links Data", 20, startPosition);

  let yPosition = startPosition + 10;

  metaLinks.forEach((item) => {
    if (yPosition > 280) {
      doc.addPage();
      pageNumber = borderAndFooter(doc, pageNumber);
      yPosition = 20;
    }

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`${item.label}`, 20, yPosition);
    doc.text(":", 50, yPosition);
    doc.setFontSize(10);

    const content_val = {
      Title:
        "Have a title tag of optimal length (between 50 and 60 characters).",
      Description:
        "Have a description tag of optimal length (150 to 160 characters).",
      Canonical:
        "Search engines have a limited budget for crawling and indexing websites, Canonical tags help save time by indicating which URL to index.",
      Language:
        "This HTML attribute is used by various programs, search engines included, to help figure out what language the page is written in. This is helpful when trying to match the right content to the right user.",
      "Robots Meta":
        "A robots meta tag is an HTML snippet that tells search engines how to interact with a page, including how to index and display it in search results.",
      "X-Robots Meta":
        "X-robots meta tag is useful for controlling how search engines index and crawl non-HTML files, like images, PDFs, and other multimedia content.",
    };

    if (item.value === "Not Available") {
      doc.setTextColor(255, 0, 0); // Red
      recommendations.push(
        `The ${item.label} is missing. Ensure to add it. ${
          content_val[item.label]
        }`
      );
    } else if (
      item.label === "Title" &&
      (item.value.length < 50 || item.value.length > 60)
    ) {
      doc.setTextColor(255, 165, 0); // Yellow
      recommendations.push(
        `Your Title lenght ${item.value.length}, Optimal (50-60 characters recommended). Adjust it.`
      );
    } else if (
      item.label === "Description" &&
      (item.value.length < 150 || item.value.length > 160)
    ) {
      doc.setTextColor(255, 165, 0); // Yellow
      recommendations.push(
        `Your Description length ${item.value.length}, Optimal (150-160 characters recommended). Adjust it.`
      );
    } else {
      doc.setTextColor(0, 0, 0); // Black
    }

    const wrappedText = doc.splitTextToSize(item.value, 140);
    wrappedText.forEach((line) => {
      if (yPosition > 280) {
        doc.addPage();
        pageNumber = borderAndFooter(doc, pageNumber);
        yPosition = 20;
      }
      doc.text(line, 55, yPosition);
      yPosition += 7;
    });
  });

  if (recommendations.length > 0) {
    yPosition += 10;
    doc.setFontSize(14);
    doc.setTextColor(255, 0, 0); // Red
    doc.text("Recommendations", 20, yPosition);
    yPosition += 10;

    recommendations.forEach((rec) => {
      if (yPosition > 280) {
        doc.addPage();
        pageNumber = borderAndFooter(doc, pageNumber);
        yPosition = 20;
      }

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont("ZapfDingbats");
      doc.text(String.fromCharCode(334), 20, yPosition);
      doc.setFont("helvetica", "normal");
      const splitText = doc.splitTextToSize(`${rec}`, 170);
      splitText.forEach((line) => {
        doc.text(line, 24, yPosition);
        yPosition += 7;
      });
    });
  }

  return [yPosition + 10, pageNumber];
};

// import { borderAndFooter } from "./borderandfooter";
// export const addMetaLinksDetails = (doc, info, startPosition, pageNumber) => {
//   const metaLinks = [
//     { label: "URL", value: info.url },
//     { label: "Title", value: info.title },
//     { label: "Description", value: info.description },
//     { label: "Canonical", value: info.canonical },
//     { label: "Language", value: info.lang },
//     { label: "Robots Meta", value: info.robots },
//     { label: "X-Robots Meta", value: info.xRobots },
//   ];

//   // Title of the Report
//   pageNumber = borderAndFooter(doc, pageNumber); // Use the imported function
//   doc.setFontSize(16);
//   doc.setTextColor(0, 123, 255);
//   doc.setFont(undefined, "bold");
//   doc.text("OnPage SEO Analysis", 105, 20, { align: "center" });

//   doc.setFontSize(14);
//   doc.setFont(undefined, "normal");
//   doc.text("Meta Links Data", 20, startPosition);
//   let yPosition = startPosition + 10;

//   metaLinks.forEach((item) => {
//     if (yPosition > 280) {
//       doc.addPage();
//       pageNumber = borderAndFooter(doc, pageNumber);
//       yPosition = 20;
//     }

//     // Set label text
//     doc.setFontSize(12);
//     doc.setTextColor(0, 0, 0);
//     doc.text(`${item.label}`, 20, yPosition);
//     doc.text(":", 50, yPosition);
//     doc.setFontSize(10);

//     // Determine text color based on conditions
//     if (item.value === "Not Available") {
//       doc.setTextColor(255, 0, 0); // Red color for "Not Available"
//     } else if (
//       (item.label === "Title" &&
//         (item.value.length < 50 || item.value.length > 60)) ||
//       (item.label === "Description" &&
//         (item.value.length < 150 || item.value.length > 160))
//     ) {
//       doc.setTextColor(255, 165, 0); // Yellow color for invalid Title/Description length
//     } else {
//       doc.setTextColor(0, 0, 0); // Default black color
//     }

//     // Wrap and display text
//     const pageWidth = 140;
//     const wrappedText = doc.splitTextToSize(item.value, pageWidth);

//     wrappedText.forEach((line) => {
//       if (yPosition > 280) {
//         pageNumber++;
//         doc.addPage();
//         pageNumber = borderAndFooter(doc, pageNumber); // Use the imported function
//         yPosition = 20;
//       }
//       doc.text(line, 55, yPosition);
//       yPosition += 7;
//     });
//   });

//   return [yPosition + 15, pageNumber];
// };
