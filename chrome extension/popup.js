document.getElementById("openApp").addEventListener("click", () => {
  chrome.tabs.create({ url: "https://freelance-web-blue.vercel.app/" });
  
});
