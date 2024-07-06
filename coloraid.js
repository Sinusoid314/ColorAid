//Import the ColorJS library
import Color from "https://colorjs.io/dist/color.js";
import {colorNames} from "./colorNames.js";

//Define the color references
class ColorRef
{
  constructor(refName, displayName)
  {
    this.name = displayName;
    this.color = new Color(refName);
  }
}

var colorRefs = [];
colorNames.forEach(name => colorRefs.push(new ColorRef(name[0], name[1])));

//Define interface variables
var cameraBtn = document.getElementById("cameraBtn");
var snapshotBtn = document.getElementById("snapshotBtn");
var cameraView = document.getElementById("cameraView");
var snapshotView = document.getElementById("snapshotView");
var snapshotContext = snapshotView.getContext("2d");
var matchView = document.getElementById("matchView");
var version = document.getElementById("version");

//Make sure the snapshot canvas' actual size is the same as the camera view's CSS size
snapshotView.width = cameraView.offsetWidth;
snapshotView.height = cameraView.offsetHeight;

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
  snapshotView.width = cameraView.videoWidth;
  snapshotView.height = cameraView.videoHeight;

  snapshotContext.drawImage(cameraView, 0, 0, cameraView.videoWidth, cameraView.videoHeight);
  snapshotBtn_OnClick();
}

function snapshotView_OnClick(eventObj)
//Find the closest matching color to the selected snapshot pixel
{
  var snapshotViewRect;
  var sampleX;
  var sampleY;
  var rgbData;
  var sampleColor;
  var matchColorRef;
  var leastDistance;
  var refDistance;

  //Set sampleX/Y to the event click-point, relative to snapshotView
  snapshotViewRect = snapshotView.getBoundingClientRect();
  sampleX = Math.round(eventObj.clientX - snapshotViewRect.left);
  sampleY = Math.round(eventObj.clientY - snapshotViewRect.top);

  //Get the pixel color at sampleX/Y
  rgbData = snapshotContext.getImageData(sampleX, sampleY, 1, 1).data;
  sampleColor = new Color("srgb", [(rgbData[0] / 255), (rgbData[1] / 255), (rgbData[2] / 255)]);

  //Find the color reference that sampleColor is nearest to
  leastDistance = sampleColor.distance(colorRefs[0].color, "lab");
  matchColorRef = colorRefs[0];
  for(var refIndex = 1; refIndex < colorRefs.length; refIndex++)
  {
    refDistance = sampleColor.distance(colorRefs[refIndex].color, "lab");
    if(refDistance < leastDistance)
    {
      leastDistance = refDistance;
      matchColorRef = colorRefs[refIndex];
    }
  }

  //Display the name of the matching color at the click-point
  matchView.innerText = matchColorRef.name;
  matchView.style.left = eventObj.pageX;
  matchView.style.top = eventObj.pageY;
  matchView.style.display = "block";
}

