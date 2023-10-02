console.log("i've been injected");
let container = document.createElement("div");
// let bigContainer = document.createElement("div")

container.style.width = "551px";
container.style.height = "86px";
container.style.background = "black";
container.style.position = "fixed";
container.style.bottom = "47px";
container.style.left = "40px";
container.style.borderRadius = "200px";
container.style.zIndex = "10000000000";
container.style.borderWidth = "8px";
container.style.borderColor = "white";
container.style.borderStyle = "solid";
container.style.padding = "12px 40px 12px 16px";
container.style.color = "white";
container.style.fontSize = "16px";
container.style.display = "flex";
container.style.alignItems = "center";
// container.style.justifyContent = "center";

const node = document.createElement("p");
// node.style.
const textnode = document.createTextNode("00:03:45");
container.appendChild(textnode);
// container.appendChild(node)

// document.body.height = '100vh'
document.body.appendChild(container);

var stream = null;
function onAccessApproved(stream) {
  recorder = new MediaRecorder(stream);
  recorder.start();

  recorder.onstop = function () {
    stream.getTracks().forEach(function (track) {
      if (track.readyState === "live") {
        track.stop();
      }
    });
  };

  recorder.ondataavailable = async function (event) {
    // const chunkSize = 5;
    let recordedBlob = event.data;

    var base64data;
    // var reader = new FileReader();
    // reader.readAsDataURL(recordedBlob);
    // reader.onloadend = function () {
    //   base64data = reader.result;
    //   console.log(base64data);
    // };

    const videoBlob = new Blob(
      [
        recordedBlob
      ],
      { type: recordedBlob.type }
    ); // Adjust the MIME type as per your video type

    // Specify a filename for the new File
    const filename = recordedBlob.type; // Change the filename as needed

    // Create a File from the Blob
    const videoFile = new File([videoBlob], filename, { type: recordedBlob.type }); // Adjust the type as per your video type

    console.log(recordedBlob, videoFile);

    // console.log(recordedBlob, blobFile);

    const blob = new Blob(recordedChunks, { type: recordedChunks[0].type || 'video/webm' });

    // Initialize variables for tracking the current position and the total length
    // let currentPosition = 0;
    // const totalLength = recordedBlob.size;

    // let chunks = [];

    // // Function to read the next chunk
    // function readNextChunk() {
    //   // Calculate the end position for the chunk
    //   let endPosition = currentPosition + chunkSize;

    //   // Ensure the end position does not exceed the total length
    //   if (endPosition >= totalLength) {
    //     endPosition = totalLength;
    //   }

    //   // Slice the original Blob to create a new chunk Blob
    //   const chunkBlob = recordedBlob.slice(currentPosition, endPosition);

    //   // Push the chunk Blob into the chunks array
    //   chunks.push(chunkBlob);

    //   // Update the current position for the next chunk
    //   currentPosition = endPosition;

    //   // Check if there are more chunks to read
    //   if (currentPosition) {
    //     // If there are more chunks, read the next one
    //     console.log('ayy')
    //     console.log(chunks); // Array containing all the chunks
    //     // readNextChunk();
    //   } else {
    //     // All chunks have been processed
    //     console.log("All chunks processed.");
    //     console.log(chunks); // Array containing all the chunks
    //   }
    // }

    // // Start reading the first chunk
    //  readNextChunk();

    //get blob recorded
    const buf = await recordedBlob.arrayBuffer();
    // chunks.push(event.data)
    // console.log(chunks);
    // /videos
    // Send to Backend
    await fetch("https://video-upload-fcxi.onrender.com/videos", {
      method: "POST",
      headers: {
        // "Content-Type": "multipart/form-data",
        // "Content-Type": "application/json",
        "Content-Type": "application/json",
      },
      body: videoFile,
    })
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Parse the response JSON if needed
      })
      .then((videoFile) => {
        // Handle the response data here
        console.log(videoFile);
      })
      .catch((error) => {
        // Handle errors here
        console.error(
          "There was a problem with the fetch operation:",
          error.message
        );
      });

    //convert the blob to a url
    let url = URL.createObjectURL(recordedBlob);

    // const reader = new FileReader();

    let a = document.createElement("a");
    a.style.display = "none";
    //appending the url to an a tag
    a.href = url;
    a.download = "screen-recording.webm";

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "request_recording") {
    console.log("requesting recording");

    //Create file
    fetch("https://video-upload-fcxi.onrender.com/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({}),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Parse the response JSON if needed
      })
      .then((data) => {
        // Handle the response data here
        console.log(data);
      })
      .catch((error) => {
        // Handle errors here
        console.error("There was a problem with the fetch operation:", error);
      });

    sendResponse(`processed: ${message.action}`);

    navigator.mediaDevices
      .getDisplayMedia({
        audio: true,
        video: {
          width: 9999999999,
          height: 9999999999,
        },
      })
      .then((stream) => {
        onAccessApproved(stream);
      });
  }
});
