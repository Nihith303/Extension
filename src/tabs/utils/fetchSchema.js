export const fetchSchemas = async (callback) => {
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
    ([result]) => {
      callback(result.result || []);
    }
  );
};
