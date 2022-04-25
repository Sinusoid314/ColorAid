//Define interface variables
var cameraBtn = document.getElementById("cameraBtn");
var snapshotBtn = document.getElementById("snapshotBtn");
var cameraView = document.getElementById("cameraView");
var snapshotView = document.getElementById("snapshotView");
var snapshotContext = snapshotView.getContext("2d");
var matchView = document.getElementById("matchView");

initCamera();
setEvents();

function initCamera()
{
  if('mediaDevices' in navigator)
  {
    navigator.mediaDevices.getUserMedia({video: {facingMode: "environment"}})
    .then((mediaStream) =>
    {
      cameraView.srcObject = mediaStream;
      cameraView.play();
      return mediaStream;
    })
    .catch((err) =>
    {
      alert("Unable to access camera: " + err);
    });
  }
  else
  {
    alert("Your browser does not support media devices.");
  }
}

function setEvents()
{
  cameraBtn.addEventListener("click", cameraBtn_OnClick);
  cameraBtn.addEventListener("tap", cameraBtn_OnClick);
  snapshotBtn.addEventListener("click", snapshotBtn_OnClick);
  snapshotBtn.addEventListener("tap", snapshotBtn_OnClick);
  cameraView.addEventListener("click", cameraView_OnClick);
  cameraView.addEventListener("tap", cameraView_OnClick);
  snapshotView.addEventListener("click", snapshotView_OnClick);
  snapshotView.addEventListener("tap", snapshotView_OnClick);
}

function cameraBtn_OnClick(eventObj)
//Switch to camera view
{
  cameraView.style.display = "block";
  snapshotView.style.display = "none";
  matchView.style.display = "none";

  cameraBtn.className = "highlight";
  snapshotBtn.className = "unhighlight";

  cameraText.style.display = "block";
  snapshotText.style.display = "none";
}

function snapshotBtn_OnClick(eventObj)
//Switch to snapshot view
{
  snapshotView.style.display = "block";
  cameraView.style.display = "none";

  snapshotBtn.className = "highlight";
  cameraBtn.className = "unhighlight";

  snapshotText.style.display = "block";
  cameraText.style.display = "none";
}

function cameraView_OnClick(eventObj)
//Capture snapshot from camera
{
  snapshotContext.drawImage(cameraView, 0, 0, snapshotView.width, snapshotView.height);
  snapshotBtn_OnClick();
}

function snapshotView_OnClick(eventObj)
//Find the closest matching color to the selected snapshot pixel
{
  var snapshotViewRect;
  var sampleX;
  var sampleY;
  var rgbData;
  var sampleColor = new Color(0, 0, 0);
  var matchRegion;

  //Set sampleX/Y to the event click-point, relative to snapshotView
  snapshotViewRect = snapshotView.getBoundingClientRect();
  sampleX = eventObj.clientX - snapshotViewRect.left;
  sampleY = eventObj.clientY - snapshotViewRect.top;

  //Get the HSL color at sampleX/Y
  rgbData = snapshotContext.getImageData(sampleX, sampleY, 1, 1).data;
  sampleColor.setFromRGB(rgbData[0], rgbData[1], rgbData[2]);

  //Find the color region that sampleColor is in
  matchRegion = colorRegionList.find(item => item.containsColor(sampleColor));

  //Display the name of the matching color region at the click-point
  matchView.innerHTML = matchRegion.name;
  matchView.style.left = eventObj.pageX;
  matchView.style.top = eventObj.pageY;
  matchView.style.display = "block";
}

