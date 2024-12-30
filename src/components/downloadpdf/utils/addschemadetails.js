// Code with handled nested content in the details.
import { borderAndFooter } from "./borderandfooter";
export const addSchemaDetails = (doc, schemas, yPosition, pageNumber) => {
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = 210; // Page width
  const margin = 20; // Margin on both sides
  const contentWidth = pageWidth - margin * 2;
  const lineHeight = 5;
  const columnWidths = [30, 30, 30, contentWidth - 85]; // Add a new page if starting position is too low

  if (yPosition > 297 * (3 / 4)) {
    doc.addPage();
    pageNumber = borderAndFooter(doc, pageNumber);
    yPosition = margin;
  }

  doc.setFontSize(14);
  doc.setTextColor(0, 123, 255);
  doc.setFont(undefined, "bold");
  doc.text("Schema List", 105, yPosition, { align: "center" });
  yPosition += lineHeight + 4; // Add table header

  doc.setFontSize(10);
  doc.setFont(undefined, "bold");
  doc.setTextColor(0, 0, 0); // Header labels

  doc.text("Type", margin, yPosition);
  doc.text("Name", margin + columnWidths[0], yPosition);
  doc.text("Parent", margin + columnWidths[0] + columnWidths[1], yPosition);
  doc.text(
    "Details",
    margin + columnWidths[0] + columnWidths[1] + columnWidths[2],
    yPosition
  );

  yPosition += lineHeight;
  doc.setDrawColor(0);
  doc.line(margin, yPosition, 195, yPosition); // Add underline for the header
  yPosition += lineHeight;

  doc.setFont(undefined, "normal"); // Recursive function to handle nested schemas

  const renderSchema = (schema, parentName = "", indentLevel = 0) => {
    const type = schema["@type"] || "No Type";
    const name = schema.name || "No Name";
    const parent = parentName || schema.parent || "No Parent"; // Use parentName if provided // Avoid including nested schema details in the parent row

    let details = {};
    Object.entries(schema).forEach(([key, value]) => {
      if (
        key !== "@type" &&
        key !== "name" &&
        (typeof value !== "object" || value === null)
      ) {
        details[key] = value; // Include only non-nested fields
      }
    });

    const detailText = JSON.stringify(details, null, 2); // Split text for each column

    const typeLines = doc.splitTextToSize(type, columnWidths[0] - 5);
    const nameLines = doc.splitTextToSize(name, columnWidths[1] - 5);
    const parentLines = doc.splitTextToSize(parent, columnWidths[2] - 5);
    const detailLines = doc.splitTextToSize(detailText, columnWidths[3]); // Determine the maximum number of lines needed for the row

    const maxLines = Math.max(
      typeLines.length,
      nameLines.length,
      parentLines.length,
      detailLines.length
    );

    // Check if the entire row fits on the current page
    const requiredSpace = maxLines * lineHeight;
    if (yPosition + requiredSpace > pageHeight - 10) {
      doc.addPage();
      pageNumber = borderAndFooter(doc, pageNumber);
      yPosition = margin;
    }

    // Render the row
    for (let i = 0; i < maxLines; i++) {
      if (typeLines[i]) doc.text(typeLines[i], margin, yPosition);
      if (nameLines[i])
        doc.text(nameLines[i], margin + columnWidths[0], yPosition);
      if (parentLines[i])
        doc.text(
          parentLines[i],
          margin + columnWidths[0] + columnWidths[1],
          yPosition
        );
      if (detailLines[i]) {
        doc.text(
          detailLines[i],
          margin + columnWidths[0] + columnWidths[1] + columnWidths[2],
          yPosition
        );
      }

      yPosition += lineHeight; // Move to the next line
    } // Recursively render nested schemas

    if (typeof schema === "object" && schema !== null) {
      Object.entries(schema).forEach(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          renderSchema(value, name, indentLevel + 1); // Increase indentation for nested objects
        }
      });
    }
  }; // Add schema details row by row

  schemas.forEach((schema) => {
    if (yPosition + lineHeight > pageHeight - 15) {
      doc.addPage();
      pageNumber = borderAndFooter(doc, pageNumber);
      yPosition = margin;
    }
    renderSchema(schema); // Add spacing between rows
    yPosition += 5;
  });
  return [yPosition + 10, pageNumber];
};

// // Only need to remove the nested content from the parent.
// import { borderAndFooter } from "./borderandfooter";
// export const addSchemaDetails = (doc, schemas, yPosition, pageNumber) => {
//   const pageHeight = doc.internal.pageSize.height;
//   const pageWidth = 210; // Page width
//   const margin = 20; // Margin on both sides
//   const contentWidth = pageWidth - margin * 2;
//   const lineHeight = 5;
//   const columnWidths = [30, 30, 30, contentWidth - 85];

//   // Add a new page if starting position is too low
//   if (yPosition > 297 * (3 / 4)) {
//     doc.addPage();
//     pageNumber = borderAndFooter(doc, pageNumber);
//     yPosition = margin;
//   }

//   // Add section title
//   doc.setFontSize(14);
//   doc.setTextColor(0, 123, 255);
//   doc.setFont(undefined, "bold");
//   doc.text("Schema List", 105, yPosition, { align: "center" });
//   yPosition += lineHeight + 4;

//   // Add table header
//   doc.setFontSize(10);
//   doc.setFont(undefined, "bold");
//   doc.setTextColor(0, 0, 0);

//   // Header labels
//   doc.text("Type", margin, yPosition);
//   doc.text("Name", margin + columnWidths[0], yPosition);
//   doc.text("Parent", margin + columnWidths[0] + columnWidths[1], yPosition);
//   doc.text(
//     "Details",
//     margin + columnWidths[0] + columnWidths[1] + columnWidths[2],
//     yPosition
//   );

//   yPosition += lineHeight;
//   doc.setDrawColor(0);
//   doc.line(margin, yPosition, 195, yPosition); // Add underline for the header
//   yPosition += lineHeight;

//   doc.setFont(undefined, "normal");

//   // Recursive function to handle nested schemas
//   const renderSchema = (schema, parentName = "", indentLevel = 0) => {
//     const type = schema["@type"] || "No Type";
//     const name = schema.name || "No Name";
//     const parent = parentName || schema.parent || "No Parent"; // Use parentName if provided
//     let details = JSON.stringify(schema, null, 2);

//     // Split text for each column
//     const typeLines = doc.splitTextToSize(type, columnWidths[0]);
//     const nameLines = doc.splitTextToSize(name, columnWidths[1]);
//     const parentLines = doc.splitTextToSize(parent, columnWidths[2]);
//     const detailLines = doc.splitTextToSize(details, columnWidths[3]);

//     // Determine the maximum number of lines needed for the row
//     const maxLines = Math.max(
//       typeLines.length,
//       nameLines.length,
//       parentLines.length,
//       detailLines.length
//     );

//     // Ensure there is enough space for the row
//     for (let i = 0; i < maxLines; i++) {
//       if (yPosition + lineHeight > pageHeight - 15) {
//         doc.addPage();
//         pageNumber = borderAndFooter(doc, pageNumber);
//         yPosition = margin + lineHeight; // Reset position for the new page
//       }

//       // Add each line of text for the current row
//       if (typeLines[i]) doc.text(typeLines[i], margin, yPosition);
//       if (nameLines[i])
//         doc.text(nameLines[i], margin + columnWidths[0], yPosition);
//       if (parentLines[i])
//         doc.text(
//           parentLines[i],
//           margin + columnWidths[0] + columnWidths[1],
//           yPosition
//         );
//       if (detailLines[i]) {
//         doc.text(
//           detailLines[i],
//           margin + columnWidths[0] + columnWidths[1] + columnWidths[2],
//           yPosition
//         );
//       }

//       yPosition += lineHeight; // Move to the next line
//     }

//     // Recursively render nested schemas
//     if (typeof schema === "object" && schema !== null) {
//       Object.entries(schema).forEach(([key, value]) => {
//         if (typeof value === "object" && value !== null) {
//           renderSchema(value, name, indentLevel + 1); // Increase indentation for nested objects
//         }
//       });
//     }
//   };

//   // Add schema details row by row
//   schemas.forEach((schema) => {
//     if (yPosition + lineHeight > pageHeight - 15) {
//       doc.addPage();
//       pageNumber = borderAndFooter(doc, pageNumber);
//       yPosition = margin + lineHeight * 2; // Adjust for new page
//     }

//     renderSchema(schema);

//     // Add spacing between rows
//     yPosition += 4;
//   });

//   return [yPosition + 10, pageNumber];
// };

// // Without Handing Nested json.
// import { borderAndFooter } from "./borderandfooter";

// export const addSchemaDetails = (doc, schemas, yPosition, pageNumber) => {
//   const pageHeight = doc.internal.pageSize.height;
//   const pageWidth = 210; // Page width
//   const margin = 20; // Margin on both sides
//   const contentWidth = pageWidth - margin * 2;
//   const lineHeight = 5;
//   const columnWidths = [30, 30, 30, contentWidth - 85];

//   // Add a new page if starting position is too low
//   if (yPosition > 297 * (3 / 4)) {
//     doc.addPage();
//     pageNumber = borderAndFooter(doc, pageNumber);
//     yPosition = margin;
//   }

//   // Add section title
//   doc.setFontSize(12);
//   doc.setTextColor(0, 123, 255);
//   doc.setFont(undefined, "bold");
//   doc.text("Schema List", margin, yPosition);
//   yPosition += lineHeight + 4;

//   // Add table header
//   doc.setFontSize(10);
//   doc.setFont(undefined, "bold");
//   doc.setTextColor(0, 0, 0);

//   // Header labels
//   doc.text("Type", margin, yPosition);
//   doc.text("Name", margin + columnWidths[0], yPosition);
//   doc.text("Parent", margin + columnWidths[0] + columnWidths[1], yPosition);
//   doc.text(
//     "Details",
//     margin + columnWidths[0] + columnWidths[1] + columnWidths[2],
//     yPosition
//   );

//   yPosition += lineHeight;
//   doc.setDrawColor(0);
//   doc.line(margin, yPosition, 195, yPosition); // Add underline for the header
//   yPosition += lineHeight;

//   doc.setFont(undefined, "normal");

//   // Add schema details row by row
//   schemas.forEach((schema) => {
//     if (yPosition + lineHeight > pageHeight - 15) {
//       doc.addPage();
//       pageNumber = borderAndFooter(doc, pageNumber);
//       yPosition = margin + lineHeight * 2; // Adjust for new page
//     }

//     const type = schema["@type"] || "No Type";
//     const name = schema.name || "No Name";
//     const parent = schema.parent || "No Parent";
//     const details = JSON.stringify(schema, null, 2);

//     // Split details into multiple lines if needed
//     const detailLines = doc.splitTextToSize(details, columnWidths[3]);

//     // Write content row
//     doc.text(type, margin, yPosition);
//     doc.text(name, margin + columnWidths[0], yPosition);
//     doc.text(parent, margin + columnWidths[0] + columnWidths[1], yPosition);
//     doc.text(
//       detailLines[0],
//       margin + columnWidths[0] + columnWidths[1] + columnWidths[2],
//       yPosition
//     );

//     yPosition += lineHeight;

//     // Handle additional lines in the "Details" column
//     if (detailLines.length > 1) {
//       detailLines.slice(1).forEach((line) => {
//         if (yPosition + lineHeight > pageHeight - 15) {
//           doc.addPage();
//           pageNumber = borderAndFooter(doc, pageNumber);
//           yPosition = margin + lineHeight;
//         }
//         doc.text(
//           line,
//           margin + columnWidths[0] + columnWidths[1] + columnWidths[2],
//           yPosition
//         );
//         yPosition += lineHeight;
//       });
//     }

//     // Add spacing between rows
//     yPosition += 4;
//   });

//   return [yPosition + 10, pageNumber];
// };

// // Without table in the Schema.
// import { borderAndFooter } from "./borderandfooter";

// export const addSchemaDetails = (doc, schemas, yPosition, pageNumber) => {
//   const pageHeight = doc.internal.pageSize.height;
//   const margin = 20;
//   const lineHeight = 5;

//   if (yPosition > 297 * (3 / 4)) {
//     doc.addPage();
//     pageNumber = borderAndFooter(doc, pageNumber);
//     yPosition = margin;
//   }

//   // Add section title
//   doc.setFontSize(12);
//   doc.setTextColor(0, 123, 255);
//   doc.setFont(undefined, "bold");
//   doc.text("Schema List", margin, yPosition);
//   yPosition += lineHeight;

//   doc.setFontSize(10);
//   doc.setFont(undefined, "normal");

//   schemas.forEach((schema, index) => {
//     const schemaText = `${index + 1}. ${JSON.stringify(schema, null, 2)}`;
//     const textLines = doc.splitTextToSize(
//       schemaText,
//       doc.internal.pageSize.width - margin * 2
//     );

//     textLines.forEach((line) => {
//       if (yPosition + lineHeight > pageHeight - 15) {
//         doc.addPage();
//         pageNumber = borderAndFooter(doc, pageNumber);
//         yPosition = margin;
//       }
//       doc.setTextColor(0, 0, 0);
//       doc.text(line, margin, yPosition);
//       yPosition += lineHeight;
//     });
//   });

//   return [yPosition + 10, pageNumber];
// };
