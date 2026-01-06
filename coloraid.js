import Color from "https://colorjs.io/dist/color.js";
import {colorNames} from "./colorNames.js";


class ColorRef
{
  constructor(colorName, displayName)
  {
    this.name = displayName;
    this.color = new Color(colorName);
  }
}

class ValueRange
{
  constructor(min, max)
  {
    this.min = Math.min(min, max);
    this.max = Math.max(min, max);
  }

  clamp(value)
  {
    return Math.max(this.min, Math.min(value, this.max));
  }
}

var lightnessRange = new ValueRange(0, 100);
var sampleLightnessRange = new ValueRange(20, 80);
var sampleRadius = 10;
var colorRefs = [];

var cameraText = document.getElementById("cameraText");
var snapshotText = document.getElementById("snapshotText");
var cameraBtn = document.getElementById("cameraBtn");
var snapshotBtn = document.getElementById("snapshotBtn");
var settingsOpenBtn = document.getElementById("settingsOpenBtn");
var viewContainer = document.getElementById("viewContainer");
var cameraView = document.getElementById("cameraView");
var snapshotView = document.getElementById("snapshotView");
var snapshotContext = snapshotView.getContext("2d");
var matchView = document.getElementById("matchView");
// var version = document.getElementById("version");

var settingsDialog = document.getElementById("settingsDialog");
// var settingsCloseBtn = document.getElementById("settingsCloseBtn");
var sampleLightnessMinInput = document.getElementById("sampleLightnessMinInput");
var sampleLightnessMaxInput = document.getElementById("sampleLightnessMaxInput");
var sampleRadiusInput = document.getElementById("sampleRadiusInput");


colorNames.forEach(name => colorRefs.push(new ColorRef(name[0], name[1])));

initCamera();
initSettingsUI();
setEvents();


function initCamera()
{
  if('mediaDevices' in navigator)
  {
    navigator.mediaDevices.getUserMedia({video: {facingMode: "environment", width: {max: viewContainer.clientWidth}}})
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

function initSettingsUI()
//
{
  sampleLightnessMinInput.value = sampleLightnessRange.min;
  sampleLightnessMaxInput.value = sampleLightnessRange.max;
  sampleRadiusInput.value = sampleRadius;
}

function setEvents()
{
  cameraBtn.addEventListener("click", cameraBtn_OnClick);
  cameraBtn.addEventListener("tap", cameraBtn_OnClick);
  snapshotBtn.addEventListener("click", snapshotBtn_OnClick);
  snapshotBtn.addEventListener("tap", snapshotBtn_OnClick);
  settingsOpenBtn.addEventListener("click", settingsOpenBtn_OnClick);
  settingsOpenBtn.addEventListener("tap", settingsOpenBtn_OnClick);
  cameraView.addEventListener("click", cameraView_OnClick);
  cameraView.addEventListener("tap", cameraView_OnClick);
  snapshotView.addEventListener("click", snapshotView_OnClick);
  snapshotView.addEventListener("tap", snapshotView_OnClick);

  sampleLightnessMinInput.addEventListener("input", sampleLightnessMinInput_OnInput);
  sampleLightnessMaxInput.addEventListener("input", sampleLightnessMaxInput_OnInput);
  sampleRadiusInput.addEventListener("input", sampleRadiusInput_OnInput);
}

function getAverageColor(centerX, centerY, radius, context)
//Calculate the average color of the given pixel area
{
  var left, top, sideLength;
  var rgbData, pixelOpacity, pixelColor, averageColor;
  var lSum, aSum, bSum, pixelCount;

  left = centerX - radius;
  top = centerY - radius;
  sideLength = (radius * 2) + 1;
  rgbData = context.getImageData(left, top, sideLength, sideLength).data;
  pixelColor = new Color("srgb", [0, 0, 0]);
  averageColor = new Color("lab", [0, 0, 0]);
  lSum = 0;
  aSum = 0;
  bSum = 0;
  pixelCount = 0;

  for(var pixelOffset = 0; pixelOffset < rgbData.length; pixelOffset += 4)
  {
    pixelOpacity = rgbData[pixelOffset + 3];
    if(pixelOpacity == 0)
      continue;
  
    pixelColor.srgb.r = rgbData[pixelOffset + 0] / 255;
    pixelColor.srgb.g = rgbData[pixelOffset + 1] / 255;
    pixelColor.srgb.b = rgbData[pixelOffset + 2] / 255;

    pixelColor.lab.l = sampleLightnessRange.clamp(pixelColor.lab.l);

    lSum += pixelColor.lab.l;
    aSum += pixelColor.lab.a;
    bSum += pixelColor.lab.b;

    pixelCount++;
  }

  averageColor.lab.l = lSum / pixelCount;
  averageColor.lab.a = aSum / pixelCount;
  averageColor.lab.b = bSum / pixelCount;

  return averageColor;

  // var rgbData = context.getImageData(centerX, centerY, 1, 1).data;
  // return new Color("srgb", [(rgbData[0] / 255), (rgbData[1] / 255), (rgbData[2] / 255)]);
}

function cameraBtn_OnClick(event)
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

function snapshotBtn_OnClick(event)
//Switch to snapshot view
{
  snapshotView.style.display = "block";
  cameraView.style.display = "none";

  snapshotBtn.className = "highlight";
  cameraBtn.className = "unhighlight";

  snapshotText.style.display = "block";
  cameraText.style.display = "none";
}

function settingsOpenBtn_OnClick(event)
//
{
  settingsDialog.showModal();
}

function cameraView_OnClick(event)
//Capture snapshot from camera
{
  snapshotView.width = cameraView.videoWidth;
  snapshotView.height = cameraView.videoHeight;

  snapshotContext.drawImage(cameraView, 0, 0, cameraView.videoWidth, cameraView.videoHeight);
  snapshotBtn_OnClick();
}

function snapshotView_OnClick(event)
//Find the closest matching color to the selected snapshot pixel
{
  var snapshotViewRect;
  var sampleX;
  var sampleY;
  var sampleColor;
  var matchColorRef;
  var leastDistance;
  var refDistance;

  //Set sampleX/Y to the event click-point, relative to snapshotView
  snapshotViewRect = snapshotView.getBoundingClientRect();
  sampleX = Math.round(event.clientX - snapshotViewRect.left);
  sampleY = Math.round(event.clientY - snapshotViewRect.top);

  //Get the sample color
  sampleColor = getAverageColor(sampleX, sampleY, sampleRadius, snapshotContext);

  //Find the color reference that sampleColor is nearest to
  leastDistance = sampleColor.deltaE(colorRefs[0].color, "2000");
  matchColorRef = colorRefs[0];
  for(var refIndex = 1; refIndex < colorRefs.length; refIndex++)
  {
    refDistance = sampleColor.deltaE(colorRefs[refIndex].color, "2000");
    if(refDistance < leastDistance)
    {
      leastDistance = refDistance;
      matchColorRef = colorRefs[refIndex];
    }
  }

  //Display the name of the matching color at the click-point
  matchView.innerText = matchColorRef.name;
  matchView.style.left = event.pageX;
  matchView.style.top = event.pageY;
  matchView.style.display = "block";
}

function sampleLightnessMinInput_OnInput(event)
//
{
  if(event.target.value > sampleLightnessRange.max)
    event.target.value = sampleLightnessRange.max;

  sampleLightnessRange.min = event.target.value;
}

function sampleLightnessMaxInput_OnInput(event)
//
{
  if(event.target.value < sampleLightnessRange.min)
    event.target.value = sampleLightnessRange.min;

  sampleLightnessRange.max = event.target.value;
}

function sampleRadiusInput_OnInput(event)
//
{
  sampleRadius = sampleRadiusInput.value;
}
