export const fetchHeaders = async (tabId) => {
  return new Promise((resolve, reject) => {
    try {
      chrome.scripting.executeScript(
        {
          target: { tabId },
          func: () => {
            const headers = [];
            const headerTags = Array.from(
              document.querySelectorAll("h1, h2, h3, h4, h5, h6")
            );
            headerTags.forEach((header) => {
              headers.push({
                tag: header.tagName.toLowerCase(),
                text: header.textContent.trim(),
              });
            });
            return headers;
          },
        },
        ([result]) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            const fetchedHeaders = result.result || [];
            const counts = {
              h1: fetchedHeaders.filter((h) => h.tag === "h1").length,
              h2: fetchedHeaders.filter((h) => h.tag === "h2").length,
              h3: fetchedHeaders.filter((h) => h.tag === "h3").length,
              h4: fetchedHeaders.filter((h) => h.tag === "h4").length,
              h5: fetchedHeaders.filter((h) => h.tag === "h5").length,
              h6: fetchedHeaders.filter((h) => h.tag === "h6").length,
            };
            resolve({ headers: fetchedHeaders, counts });
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });
};
