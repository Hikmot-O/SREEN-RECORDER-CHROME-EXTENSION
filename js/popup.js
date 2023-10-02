document.addEventListener("DOMContentLoaded", () => {
  //Get Selectors
  const startRecording = document.querySelector("button");

  //Add EventListeners
  startRecording.addEventListener("click", () => {
    //
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "request_recording" },
        function (response) {
          if (!chrome.runtime.lastError) {
            console.log(response);
          } else {
            console.log(chrome.runtime.lastError, "error line 14");
          }
        }
      );
    });
  });

  //   stopRecording.addEventListener("click", () => {
  //     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  //       chrome.tabs.sendMessage(
  //         tabs[0].id,
  //         { action: "stopvideo" },
  //         function (response) {
  //           if (!chrome.runtime.lastError) {
  //             console.log(response);
  //           } else {
  //             console.log(chrome.runtime.lastError, "error line 14");
  //           }
  //         }
  //       );
  //     });
  //   });
});
