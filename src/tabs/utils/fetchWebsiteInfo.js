export const fetchWebsiteInfo = async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  const tabId = tab.id;

  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript(
      {
        target: { tabId },
        func: () => {
          const meta = (name) =>
            document.querySelector(`meta[name="${name}"]`)?.content;
          const robotsMeta =
            document.querySelector('meta[name="robots"]')?.content ||
            "Not Available";
          const xRobotsMeta =
            document.querySelector('meta[http-equiv="X-Robots-Tag"]')
              ?.content || "Not Available";
          const lang = document.documentElement.lang || "Not Available";

          return {
            title: document.title,
            description: meta("description") || "Not Available",
            canonical:
              document.querySelector('link[rel="canonical"]')?.href ||
              "Not Available",
            robots: robotsMeta,
            xRobots: xRobotsMeta,
            lang: lang,
            url: window.location.href,
          };
        },
      },
      ([result]) => {
        if (result && result.result) {
          resolve(result.result);
        } else {
          reject(
            new Error(
              "Error fetching the Metalinks Summary, Please try again later."
            )
          );
        }
      }
    );
  });
};
