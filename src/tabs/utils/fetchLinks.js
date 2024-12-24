export const fetchLinks = async () => {
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
          const links = Array.from(document.querySelectorAll("a")).map((a) => ({
            href: a.href || null,
            title: a.textContent.trim() || "No title",
          }));

          const url = window.location.origin;

          const internal = links.filter((link) => link.href?.startsWith(url));
          const external = links.filter(
            (link) => link.href && !link.href.startsWith(url)
          );
          const withoutHref = links.filter((link) => !link.href);
          const unique = [...new Set(links.map((link) => link.href))].map(
            (href) => ({
              href,
              title:
                links.find((link) => link.href === href)?.title || "No title",
            })
          );

          return {
            total: links,
            internal,
            external,
            withoutHref,
            unique,
          };
        },
      },
      ([result]) => {
        if (result && result.result) {
          resolve(result.result);
        } else {
          reject(
            new Error(
              "Error Fetching the Links Details, Please try again later."
            )
          );
        }
      }
    );
  });
};
