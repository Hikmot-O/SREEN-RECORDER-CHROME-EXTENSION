
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  //if page is fully loaded and the url starts with http
  if (changeInfo.status === "complete" && /^http/.test(tab.url)) {
    chrome.scripting
      .executeScript({
        target: { tabId },
        files: ["./content.js"],
      })
      .then(() => {
        console.log("we have injected the content script");
      }).catch(err =>{
        console.log(err)
      });
  }
});
