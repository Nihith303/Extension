export const fetchImages = async (tabId) => {
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript(
      {
        target: { tabId },
        func: () => {
          const images = Array.from(document.querySelectorAll("img")).map(
            (img) => ({
              src: img.src || "No SRC",
              alt: img.alt || "No ALT",
              longDesc: img.longdesc || "No Description",
              width: img.naturalWidth || "N/A",
              height: img.naturalHeight || "N/A",
            })
          );

          const noAlt = images.filter((img) => img.alt === "No ALT");
          const noLongDesc = images.filter(
            (img) => img.longDesc === "No Description"
          );
          const noSrc = images.filter((img) => img.src === "No SRC");

          return {
            total: images,
            noAlt,
            noLongDesc,
            noSrc,
          };
        },
      },
      ([result]) => {
        if (result?.result) {
          resolve(result.result);
        } else {
          reject(
            new Error(
              "Error Fetching the images details, Please try again later."
            )
          );
        }
      }
    );
  });
};
