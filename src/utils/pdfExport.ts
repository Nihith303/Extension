import { jsPDF } from "jspdf";
import { SEOAnalysis, SchemaData } from "../types/seo";
import { checkLinks } from "./seoAnalyzer";

const pageWidth = 210;
const pageHeight = 297;

export const checkpagelength = (doc: jsPDF, y: number, data: SEOAnalysis, length:number) => {
  if (y > pageHeight * length) {
    doc.addPage();
    addDoublePageBorder(doc, data);
    y = 20;
  }
  return y;
}
export const addDoublePageBorder = (doc: jsPDF, data: SEOAnalysis) => {
  const textmargin = 5;
  const margin = 10; // Margin for the outer border
  const innerMargin = 8; // Margin for the inner border
  const footerurl = "https://digispot.ai";

  // Adding Watermark to the page
  doc.setFont('helvetica', 'normal');
  const watermarkText = "Digispot.AI";
  doc.setFontSize(70);
  doc.setTextColor(230, 230, 230);
  doc.text(watermarkText, pageWidth / 2, pageHeight / 2, {
    align: "center",
    angle: 45,
  });

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0); // Black color
  doc.text(`Report generated using Digispot.AI - SEO Insights ${data.toolVersion}`, pageWidth - textmargin, textmargin, { align: 'right' });

  // Add bottom border date
  doc.text(`Generated on: ${data.timestamp}`, textmargin, pageHeight - 3);

  const xPosition = pageWidth - 20;
  const yPosition = pageHeight - 3;
  doc.setTextColor(0, 0, 139);
  doc.text(footerurl, xPosition, yPosition, {
    align: "right",
  });
  const textWidth = doc.getTextWidth(footerurl);
  doc.setDrawColor(0, 0, 139);
  doc.line(xPosition - textWidth, yPosition + 1, xPosition, yPosition + 1);
  doc.link(
    pageWidth - 20 - doc.getTextWidth(footerurl),
    pageHeight - 12,
    doc.getTextWidth(footerurl),
    11,
    { url: footerurl }
  );
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  // Draw outer border
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2);

  // Draw inner border
  doc.setLineWidth(0.5);
  doc.rect(innerMargin, innerMargin, pageWidth - innerMargin * 2, pageHeight - innerMargin * 2);
};

const addTextWithOverflowHandling = (doc: jsPDF, text: string, x: number, y: number, data: SEOAnalysis, wraplength: number) => {
  const margin = 15; // Increase margin for more space
  const lineHeight = 7; // Decrease line height for better spacing
  const textLines = doc.splitTextToSize(text, wraplength);

  for (const line of textLines) {
    if (y + lineHeight > pageHeight - margin) {
      doc.addPage();
      addDoublePageBorder(doc, data); // Add border to the new page
      y = margin; // Reset y position for the new page
    }
    doc.text(line, x, y); // Adjust x position to account for margin
    y += lineHeight; // Add less extra space between sections
  }
  return y + 3;
};

const addBoldText = (doc: jsPDF, text: string, x: number, y: number) => {
  doc.setFont('helvetica', 'bold');
  doc.text(text, x, y);
  doc.setFont('helvetica', 'normal');
  return y + 7;
};

const addMetaLinks = (doc: jsPDF, data: SEOAnalysis, margin: number) => {
  let y = margin; // Start y position for text inside the border

  // Add main header
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 255); // Blue color
  doc.setFont('helvetica', 'bold');
  doc.text("OnPage SEO Audit", 105, y, { align: 'center' });
  y += 10; // Move down for the next line

  // Add side header
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 255); // Black color
  doc.text("MetaLinksdata", margin, y);
  y += 10; // Move down for the next line
  const wraplength = 180;
  doc.setFont('helvetica', 'normal');
  // Use addBoldText for all titles
  doc.setTextColor(0, 0, 0);
  y = addBoldText(doc, 'URL:', margin, y);
  y = addTextWithOverflowHandling(doc, data.overview.url.raw, margin, y, data, wraplength);
  y = addBoldText(doc, 'Canonical:', margin, y);
  y = addTextWithOverflowHandling(doc, data.overview.url.canonical, margin, y, data, wraplength);
  y = addBoldText(doc, 'Title:', margin, y);
  y = addTextWithOverflowHandling(doc, data.overview.title.content, margin, y, data, wraplength);
  y = addBoldText(doc, 'Meta Description:', margin, y);
  y = addTextWithOverflowHandling(doc, data.overview.description.content, margin, y, data, wraplength);
  y = addBoldText(doc, 'Language:', margin, y);
  y = addTextWithOverflowHandling(doc, `Declared - ${data.overview.language.declared}, Detected - ${data.overview.language.detected}`, margin, y, data, wraplength);
  y = addBoldText(doc, 'Charset:', margin, y);
  y = addTextWithOverflowHandling(doc, data.overview.charset, margin, y, data, wraplength);
  y = addBoldText(doc, 'Keywords:', margin, y);
  y = addTextWithOverflowHandling(doc, data.overview.keywords.join(', '), margin, y, data, wraplength);
  y = addBoldText(doc, 'Mobile Optimization:', margin, y);
  y = addTextWithOverflowHandling(doc, data.overview.viewport.content, margin, y, data, wraplength);
  y = addBoldText(doc, 'Robots Meta:', margin, y);
  y = addTextWithOverflowHandling(doc, `Index - ${data.overview.robotsMeta.index ? 'Yes' : 'No'}, Follow - ${data.overview.robotsMeta.follow ? 'Yes' : 'No'}`, margin, y, data, wraplength);
  y = addBoldText(doc, 'Robots.txt Status:', margin, y);
  y = addTextWithOverflowHandling(doc, `${data.overview.robotsTxt.hasRobotsTxt ? 'File exists' : 'File not found'} - Crawling ${data.overview.robotsTxt.allowsCrawling}`, margin, y, data, wraplength);

  // Add Recommendations Section
  doc.setTextColor(255, 0, 0);
  y = addBoldText(doc, 'Recommendations:', margin, y);

  const addRecommendations = (doc: jsPDF, issues: string[], x: number, y: number) => {
    if (issues.length === 0) {
      return addTextWithOverflowHandling(doc, 'No recommendations needed.', x, y, data, wraplength);
    }
    for (const issue of issues) {
      y = addTextWithOverflowHandling(doc, `- ${issue}`, x, y, data, wraplength);
    }
    return y + 10;
  };

  // Collect issues from data
  const issues = [
    ...data.overview.title.issues || [],
    ...data.overview.description.issues || [],
    ...data.overview.url.canonical ? [] : ['Canonical URL is missing.'],
    ...data.overview.language.isValid ? [] : ['Language declaration is invalid.'],
    ...data.overview.keywords.length ? [] : ['No keywords found.'],
    ...data.overview.viewport.isMobileOptimized ? [] : ['Page is not mobile optimized.'],
    ...data.overview.robotsMeta.index ? [] : ['Page is not set to index.'],
    ...data.overview.robotsMeta.follow ? [] : ['Page is not set to follow links.'],
    ...data.overview.robotsTxt.hasRobotsTxt ? [] : ['robots.txt file is missing.'],
  ];

  // Add recommendations to the PDF
  y = addRecommendations(doc, issues, margin, y);

  return y;
};

const addQuickStats = async (doc: jsPDF, data: SEOAnalysis, y: number): Promise<[number, { [key: string]: boolean }]> => {
  y = checkpagelength(doc, y, data, 0.75);
  const margin = 15; // Start y position for text inside the border
  const sectionWidth = (pageWidth - margin * 2) / 3; // Divide the page width into three sections
  const heighty = y;

  // Links Quick Stats
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('Links Quick Stats', margin, y);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  y += 7;
  doc.text(`Total Links: ${data.links.analysis.totalCount}`, margin, y);
  y += 7;
  doc.text(`Internal Links: ${data.links.analysis.internalCount}`, margin, y);
  y += 7;
  doc.text(`External Links: ${data.links.analysis.externalCount}`, margin, y);
  y += 7;
  doc.text(`Other Links: ${data.links.analysis.otherCount}`, margin, y);
  y += 7;
  const brokenLinks = await checkLinks(data.links);
  const brokenCount = Object.values(brokenLinks).filter(isBroken => isBroken).length;
  doc.text(`Broken Links: ${brokenCount}`, margin, y);

  // Calculate the count of images without a `src` attribute
  const missingSrcCount = data.images.images.filter(image => !image.src).length;

  // Images Quick Stats
  let x = margin + sectionWidth;
  y = heighty;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 255);
  doc.text('Images Quick Stats', x, y);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  y += 7;
  doc.text(`Total Images: ${data.images.analysis.totalCount}`, x, y);
  y += 7;
  doc.text(`Without ALT: ${data.images.analysis.missingAlt}`, x, y);
  y += 7;
  doc.text(`Without Dimensions: ${data.images.analysis.missingDimensions}`, x, y);
  y += 7;
  doc.text(`Without SRC: ${missingSrcCount}`, x, y);

  // Header Count
  x += sectionWidth;
  y = heighty;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 255);
  doc.text('Header Count', x, y);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  y += 7;
  doc.text(`H1: ${data.headings.structure.h1.length}`, x, y);
  y += 7;
  doc.text(`H2: ${data.headings.structure.h2.length}`, x, y);
  y += 7;
  doc.text(`H3: ${data.headings.structure.h3.length}`, x, y);
  y += 7;
  doc.text(`H4: ${data.headings.structure.h4.length}`, x, y);
  y += 7;
  doc.text(`H5: ${data.headings.structure.h5.length}`, x, y);
  y += 7;
  doc.text(`H6: ${data.headings.structure.h6.length}`, x, y);
  // Add recommendations section only if any count is more than 0
  const headerIssues = data.headings.analysis.issues;
  if (brokenCount > 0 || data.images.analysis.missingAlt > 0 || data.images.analysis.missingDimensions > 0 || missingSrcCount > 0 || headerIssues.length > 0) {
    y += 10;
    doc.setTextColor(255, 0, 0); // Red color for recommendations
    doc.setFont('helvetica', 'bold');
    doc.text('Recommendations', margin, y);
    doc.setFont('helvetica', 'normal');
    y += 7;

    // Add broken links recommendation if count is more than 1
    if (brokenCount > 0) {
      doc.text(`- Address ${brokenCount} broken links to improve site navigation.`, margin, y);
      y += 7;
    }
    // Add image issues recommendations if counts are more than 1
    if (data.images.analysis.missingAlt > 0) {
      doc.text(`- Improve ${data.images.analysis.missingAlt} images missing ALT text for better accessibility.`, margin, y);
      y += 7;
    }
    if (data.images.analysis.missingDimensions > 0) {
      doc.text(`- Add dimensions to ${data.images.analysis.missingDimensions} images for better layout stability.`, margin, y);
      y += 7;
    }
    if (missingSrcCount > 0) {
      doc.text(`- Fix ${missingSrcCount} images without SRC to ensure they load correctly.`, margin, y);
      y += 7;
    }
    if (headerIssues.length > 0) {
      headerIssues.forEach(issue => {
        doc.text(`- ${issue}`, margin, y);
        y += 7;
      });
    }
  }
  return [y + 10, brokenLinks];
};

const addHeadingStructure = (doc: jsPDF, data: SEOAnalysis, margin: number, y: number) => {
  doc.setTextColor(0, 0, 255); // Reset color to black
  doc.setFont('helvetica', 'bold');
  doc.text('Headers in Order of Appearance', margin, y);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  y += 7;
  y = checkpagelength(doc, y, data, 0.75);
  const allHeaders = [
    ...data.headings.structure.h1.map(header => ({ ...header, level: 1 })),
    ...data.headings.structure.h2.map(header => ({ ...header, level: 2 })),
    ...data.headings.structure.h3.map(header => ({ ...header, level: 3 })),
    ...data.headings.structure.h4.map(header => ({ ...header, level: 4 })),
    ...data.headings.structure.h5.map(header => ({ ...header, level: 5 })),
    ...data.headings.structure.h6.map(header => ({ ...header, level: 6 }))
  ];
  allHeaders.sort((a, b) => a.position - b.position); // Sort headers by their position
  const wraplength = 180;
  allHeaders.forEach(header => {
    if (y > 285) {
      doc.addPage();
      addDoublePageBorder(doc, data);
      y = 20;
    }
    y = addTextWithOverflowHandling(doc, `<H${header.level}> ${header.content}`, margin, y, data, wraplength);
  });
  return y + 10;
}

const addLinksTable = (doc: jsPDF, data: SEOAnalysis, margin: number, y: number, brokenLinks: { [key: string]: boolean }) => {
  const categories = [
    { name: 'Internal', links: data.links.internal },
    { name: 'External', links: data.links.external },
    { name: 'Other', links: data.links.otherLinks },
    { name: 'Broken', links: [...data.links.internal, ...data.links.external].filter(link => brokenLinks[link.href]) }
  ];

  const tableHeaders = ['URL', 'Title'];
  const headerHeight = 10;
  const rowHeight = 5;
  const remainingWidth = 210 - margin * 2;
  const urlWidth = remainingWidth * 0.75;
  const titleWidth = remainingWidth * 0.25;

  // Center the "Links" title
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 255);
  doc.setFontSize(14);
  doc.text('Links', 105, y, { align: 'center' });

  categories.forEach(category => {
    if (category.links.length === 0) {
      doc.setFontSize(12);
      doc.setTextColor(255, 0, 0);
      doc.text(`No links in ${category.name} category`, margin, y);
      y += headerHeight;
      return;
    }

    // Add side heading for each category
    doc.setFontSize(12);
    doc.setTextColor(0, 123, 255);
    y += headerHeight;
    doc.text(`${category.name} Links`, margin, y);
    y += headerHeight;

    // Draw table header
    if (y > pageHeight - 12){
        doc.addPage();
        addDoublePageBorder(doc, data);
        y = margin;
    }
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    let x = margin;
    tableHeaders.forEach((header, index) => {
      doc.text(header, x, y);
      x += index === 1 ? titleWidth : urlWidth;
    });
    y += headerHeight;

    // Draw table rows
    doc.setFont('helvetica', 'normal');
    category.links.forEach(link => {
      x = margin;

      // Wrap URL and Title
      const urlText = doc.splitTextToSize(link.href, urlWidth - 5);
      const titleText = doc.splitTextToSize(link.text, titleWidth - 5);
      const rowHeightNeeded = Math.max(urlText.length, titleText.length) * rowHeight;

      // Check if there's enough space for the row, if not, add a new page
      if (y + rowHeightNeeded > pageHeight - 12) {
        doc.addPage();
        addDoublePageBorder(doc, data);
        y = margin;
      }

      // Set URL color to dark blue
      doc.setTextColor(0, 0, 139);
      urlText.forEach((line: string, index: number) => {
        doc.textWithLink(line, x, y + index * rowHeight, { url: link.href });
      });

      // Reset color for other text
      doc.setTextColor(0, 0, 0);
      titleText.forEach((line: string, index: number) => {
        if (line === "No Text"){
            doc.setTextColor(255, 0, 0);
        }else{
            doc.setTextColor(0, 0, 0);
        }
        doc.text(line, x + urlWidth, y + index * rowHeight);
      });
      doc.setTextColor(0, 0, 0);
      y += rowHeightNeeded + 3;
    });
  });

  return y + 15; // Return the new y position after the table
};

const addImagesTable = (doc: jsPDF, data: SEOAnalysis, margin: number, y: number) => {
  const images = data.images.images.filter(image => !image.alt || !image.src || !image.width || !image.height);

  const tableHeaders = ['URL', 'ALT', 'Size', 'Status'];
  const headerHeight = 10;
  const rowHeight = 5;
  const remainingWidth = 210 - margin * 2;
  const urlWidth = remainingWidth * 0.6;
  const altWidth = remainingWidth * 0.15;
  const sizeWidth = remainingWidth * 0.125;
  const statusWidth = remainingWidth * 0.125;

  // Center the "Images" title
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 255);
  doc.setFontSize(14);
  doc.text('Images with missing attributes', 105, y, { align: 'center' });
  y += headerHeight;

  if (images.length === 0) {
    doc.setFontSize(12);
    doc.setTextColor(255, 0, 0);
    doc.text('No images with missing attributes', margin, y);
    y += headerHeight;
    return y + 10;
  }

  // Draw table header
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  let x = margin;
  tableHeaders.forEach((header, index) => {
    doc.text(header, x, y);
    x += index === 3 ? statusWidth : (index === 2 ? sizeWidth : (index === 1 ? altWidth : urlWidth));
  });
  y += headerHeight;

  // Draw table rows
  doc.setFont('helvetica', 'normal');
  images.forEach(image => {
    x = margin;

    // Wrap URL, ALT, and Size
    const url = doc.splitTextToSize(image.src || 'Not Available', urlWidth - 5);
    const alt = doc.splitTextToSize(image.alt || 'Not Available', altWidth - 5);
    const size = `${image.width || 'N/A'} x 
${image.height || 'N/A'}`;
    const status = image.status;

    // Calculate the maximum number of lines needed for this row
    const maxLines = Math.max(url.length, alt.length);

    // Check if the row fits on the current page
    if (y + (maxLines * rowHeight) > pageHeight - margin) {
      doc.addPage();
      addDoublePageBorder(doc, data);
      y = margin;
    }

    // Draw each line of the row
    for (let i = 0; i < maxLines; i++) {
      if (url[i]) {
        doc.setTextColor(0, 0, 139); // Dark blue color for URL
        doc.textWithLink(url[i], x, y, { url: image.src || '' });
      }
      if (alt[i]) {
        doc.setTextColor(alt[i] === 'Not' || alt[i] === 'Available' ? 255 : 0, 0, 0); // Red for 'Not Available'
        doc.text(alt[i], x + urlWidth, y);
      }
      if (i === 0) {
        doc.setTextColor(size.includes('N/A') ? 255 : 0, 0, 0); // Red for 'N/A'
        doc.text(size, x + urlWidth + altWidth, y);
        // Set text color based on status
        if (status === 'warning') {
          doc.setTextColor(255, 255, 0); // Yellow for 'warning'
        } else if (status === 'error') {
          doc.setTextColor(255, 0, 0); // Red for 'error'
        } else {
          doc.setTextColor(0, 0, 0); // Default color
        }
        doc.text(status, x + urlWidth + altWidth + sizeWidth, y);
      }
      y += rowHeight;
    }
    y += 3;
  });
  return y + 10;
};


const addSocialData = (doc: jsPDF, data: SEOAnalysis, margin: number, y: number) => {
  y = checkpagelength(doc, y, data, 0.4);
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 255); // Blue color for section header
  doc.setFont('helvetica', 'bold');
  doc.text('Social Media Analysis', 105, y, {align: 'center'});
  doc.setTextColor(0, 0, 0); // Reset color to black
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  y += 10;

  // Add analysis summary
  const socialData = data.social;
  const contentX = 50; // Set a fixed x position for content

  const requiredTagsStatus = socialData.analysis.hasRequiredTags ? 'All required tags present' : 'Missing required tags';
  const imagesOptimizedStatus = socialData.analysis.imagesOptimized ? 'Images are optimized' : 'Images are not optimized';

  doc.setFont('helvetica', 'bold');
  doc.text('Required Tags:', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text(requiredTagsStatus, contentX + 20, y);
  y += 7;

  doc.setFont('helvetica', 'bold');
  doc.text('Images Optimization:', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text(imagesOptimizedStatus, contentX + 20, y);
  y += 7;

  const wraplength = 150;
  // Add detailed social media data
  doc.setFont('helvetica', 'bold');
  doc.text('Open Graph Data:', margin, y);
  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Title:', margin, y);
  doc.setFont('helvetica', 'normal');
  y = addTextWithOverflowHandling(doc,socialData.openGraph.title || 'Not Available', contentX, y, data, wraplength);
  y -= 3;
  doc.setFont('helvetica', 'bold');
  doc.text('Description:', margin, y);
  doc.setFont('helvetica', 'normal');
  y = addTextWithOverflowHandling(doc,socialData.openGraph.description || 'Not Available', contentX, y, data, wraplength);
  y -= 3;
  // y = addTextWithOverflowHandling(doc, `Description: ${socialData.openGraph.description || 'Not Available'}`, contentX, y, data, wraplength);
  doc.setFont('helvetica', 'bold');
  doc.text('Image URL:', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text(socialData.openGraph.image.url || 'Not Available', contentX, y);
  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Site Name:', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text(socialData.openGraph.site_name || 'Not Available', contentX, y);
  y += 15;

  doc.setFont('helvetica', 'bold');
  doc.text('Twitter Card Data:', margin, y);
  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Card Type:', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text(socialData.twitter.card || 'Not Available', contentX, y);
  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Title:', margin, y);
  doc.setFont('helvetica', 'normal');
  y = addTextWithOverflowHandling(doc,socialData.twitter.title || 'Not Available', contentX, y, data, wraplength);
  y -= 3;
  doc.setFont('helvetica', 'bold');
  doc.text('Description:', margin, y);
  doc.setFont('helvetica', 'normal');
  y = addTextWithOverflowHandling(doc,socialData.twitter.description || 'Not Available', contentX, y, data, wraplength);
  y -= 3;
  // y = addTextWithOverflowHandling(doc, `Description: ${socialData.twitter.description || 'Not Available'}`, contentX, y, data, wraplength);
  doc.setFont('helvetica', 'bold');
  doc.text('Image URL:', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text(socialData.twitter.image.url || 'Not Available', contentX, y);
  y += 7;
  return y + 10;
};

const addSchemaData = (doc: jsPDF, schemaData: SchemaData, margin: number, y: number, data: SEOAnalysis) => {
  const checkPageLength = (doc: jsPDF, y: number) => {
      if (y > pageHeight - 20) { // 20mm margin from bottom
          doc.addPage();
          addDoublePageBorder(doc, data);
          y = 20; // Reset y position for the new page
      }
      return y;
  };

  y = checkPageLength(doc, y);
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 255); // Blue color for section header
  doc.setFont('helvetica', 'bold');
  doc.text('Schema Markup Analysis', 105, y, { align: 'center' });
  doc.setTextColor(0, 0, 0); // Reset color to black
  y += 10;

  // Add analysis summary
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Schemas: ${schemaData.analysis.totalCount}`, margin, y);
  y += 7;
  y = checkPageLength(doc, y);
  doc.text(`Valid Schemas: ${schemaData.analysis.validCount}`, margin, y);
  y += 7;
  y = checkPageLength(doc, y);
  doc.text(`Invalid Schemas: ${schemaData.analysis.totalCount - schemaData.analysis.validCount}`, margin, y);
  y += 10;
  y = checkPageLength(doc, y);

  // Add issues if any
  if (schemaData.analysis.issues.length > 0) {
      doc.setTextColor(255, 0, 0); // Red color for issues
      doc.text('General Issues:', margin, y);
      y += 7;
      y = checkPageLength(doc, y);
      schemaData.analysis.issues.forEach(issue => {
          doc.setTextColor(0, 0, 0); // Reset color to black
          doc.text(`- ${issue}`, margin, y);
          y += 7;
          y = checkPageLength(doc, y);
      });
  }

  // Check if there are valid schemas
  if (schemaData.analysis.validCount === 0) {
    doc.setTextColor(255, 0, 0); // Red color for message
    doc.text('No valid schemas to show.', margin, y);
    return 404;
  }

  // Add table header if there are valid schemas
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 255);
  doc.text("Valid Schemas details", margin, y);
  y += 10;
  doc.setTextColor(0, 0, 0);
  doc.text('Type', margin, y);
  doc.text('Name', margin + 30, y);
  doc.text('Parent', margin + 60, y);
  doc.text('Details', margin + 90, y);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  y += 7;
  y = checkPageLength(doc, y);

  const renderSchema = (schema: any, parentName = "", indentLevel = 0) => {
      const type = schema["@type"] || "No Type";
      const name = schema.name || "No Name";
      const parent = parentName || schema.parent || "No Parent";

      let details: Record<string, any> = {};
      Object.entries(schema).forEach(([key, value]) => {
          if (key !== "@type" && key !== "name" && (typeof value !== "object" || value === null)) {
              details[key] = value;
          }
      });

      const detailText = JSON.stringify(details, null, 2);

      const typeLines = doc.splitTextToSize(type, 27);
      const nameLines = doc.splitTextToSize(name, 27);
      const parentLines = doc.splitTextToSize(parent, 27);
      const detailLines = doc.splitTextToSize(detailText, 95);

      const maxLines = Math.max(typeLines.length, nameLines.length, parentLines.length, detailLines.length);

      const requiredSpace = maxLines * 7;
      if (y + requiredSpace > pageHeight - 10) {
          doc.addPage();
          addDoublePageBorder(doc, data);
          y = 20;
      }

      for (let i = 0; i < maxLines; i++) {
          if (typeLines[i]) doc.text(typeLines[i], margin, y);
          if (nameLines[i]) doc.text(nameLines[i], margin + 30, y);
          if (parentLines[i]) doc.text(parentLines[i], margin + 60, y);
          if (detailLines[i]) doc.text(detailLines[i], margin + 90, y);
          y += 7;
      }

      if (typeof schema === "object" && schema !== null) {
          Object.entries(schema).forEach(([_, value]) => {
              if (typeof value === "object" && value !== null) {
                  renderSchema(value, name, indentLevel + 1);
              }
          });
      }
  };

  // Add schema details row by row
  schemaData.schemas.forEach((schema) => {
      if (y > pageHeight - 12) {
          doc.addPage();
          addDoublePageBorder(doc, data);
          y = 20;
      }
      renderSchema(schema);
      y += 7;
  });

  return y + 10; // Return the new y position after adding schema data
};

const addGraphToPDF = (doc: jsPDF, graphRef: React.RefObject<HTMLDivElement>, y: number, data: SEOAnalysis) => {
  const svgElement = graphRef.current?.querySelector("svg");
  if (!svgElement){
    return;
  }
  const clonedSvg = svgElement.cloneNode(true) as SVGElement;
  const bbox = svgElement.getBBox();
  const width = bbox.width;
  const height = bbox.height;

  clonedSvg.setAttribute("viewBox", `${bbox.x.toString()} ${bbox.y.toString()} ${width.toString()} ${height.toString()}`);
  clonedSvg.setAttribute("width", width.toString());
  clonedSvg.setAttribute("height", height.toString());

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
    if (ctx) {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, width * scaleFactor, height * scaleFactor);
    }

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

    if (y + imgHeight + 20 > pageHeight) {
      doc.addPage();
      addDoublePageBorder(doc, data);
      y = 30;
    } 

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 255);
    doc.setFont('helvetica', 'bold');
    doc.text("Schema Structure", 105, y - 10, { align: "center" });
    console.log("Added Schema Structure");
    doc.addImage(canvas.toDataURL("image/png"), "PNG", x, y + 10, imgWidth, imgHeight);
    console.log("Added Schema Graph Image");
    URL.revokeObjectURL(url);
    doc.save(`seo-audit-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  img.onerror = () => {
    console.error("Error occurred while loading the image for download.");
  };

  img.src = url;
};

export const exportSEOReportToPDF = async (data: SEOAnalysis, graphRef: React.RefObject<HTMLDivElement>) => {
  const doc = new jsPDF();
  addDoublePageBorder(doc, data);
   const margin = 15;
  let y = addMetaLinks(doc, data, margin);
  let brokenLinks: { [key: string]: boolean };
  [y, brokenLinks] = await addQuickStats(doc, data, y);
  y = addHeadingStructure(doc, data, margin, y);
  y = addLinksTable(doc, data, margin, y, brokenLinks);
  y = addImagesTable(doc, data, margin, y);
  y = addSocialData(doc, data, margin, y);
  y = addSchemaData(doc, data.schema, margin, y, data);
  if (y !== 404){
    addGraphToPDF(doc, graphRef, y, data);
  }else{
    doc.save(`seo-audit-report-${new Date().toISOString().split('T')[0]}.pdf`);
  }
};