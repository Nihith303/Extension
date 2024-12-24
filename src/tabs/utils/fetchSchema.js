export const fetchSchemas = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      const tabId = tab.id;

      chrome.scripting.executeScript(
        {
          target: { tabId },
          func: () => {
            const schemaScripts = Array.from(
              document.querySelectorAll('script[type="application/ld+json"]')
            );
            return schemaScripts
              .map((script) => {
                try {
                  return JSON.parse(script.innerText);
                } catch {
                  return null;
                }
              })
              .filter(Boolean);
          },
        },
        (results) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else if (results && results.length > 0) {
            resolve(results[0].result || []);
          } else {
            resolve([]);
          }
        }
      );
    } catch (error) {
      reject(new Error("Error Fetching the Schema, Please try again later."));
    }
  });
};

// export const fetchSchemas = async (callback) => {
//   const [tab] = await chrome.tabs.query({
//     active: true,
//     currentWindow: true,
//   });
//   const tabId = tab.id;

//   chrome.scripting.executeScript(
//     {
//       target: { tabId },
//       func: () => {
//         const schemaScripts = Array.from(
//           document.querySelectorAll('script[type="application/ld+json"]')
//         );
//         return schemaScripts
//           .map((script) => {
//             try {
//               return JSON.parse(script.innerText);
//             } catch {
//               return null;
//             }
//           })
//           .filter(Boolean);
//       },
//     },
//     ([result]) => {
//       callback(result.result || []);
//     }
//   );
// };
