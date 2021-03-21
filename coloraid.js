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
        navigator.mediaDevices.getUserMedia({ video: true })
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
    var sampleX = 0;
    var sampleY = 0;
    var sampleColor;
    var testDistance = 0;
    var closestDistance = 0;
    var closestColorIndex = 0;

    //Set sampleX/Y to the event click-point, relative to snapshotView
    snapshotViewRect = snapshotView.getBoundingClientRect();
    sampleX = eventObj.clientX - snapshotViewRect.left;
    sampleY = eventObj.clientY - snapshotViewRect.top;

    //Set sampleColor to the color at the sampleX/Y
    sampleColor = snapshotContext.getImageData(sampleX, sampleY, 1, 1).data;

    //Loop through preDefColorList
    for(var listIndex=0; listIndex < colorList.length; listIndex++)
    {
        //Set testDistance to the distance between sampleColor and the current preDefColorList item
        //(the square-root in the distance formula is ommitted to simplify calculation)
        testDistance = Math.pow(colorList[listIndex].red - sampleColor[0], 2)
			         + Math.pow(colorList[listIndex].green - sampleColor[1], 2)
			         + Math.pow(colorList[listIndex].blue - sampleColor[2], 2);

        if((listIndex == 0) || (testDistance < closestDistance))
        {
            closestDistance = testDistance;
            closestColorIndex = listIndex;
	    }
    }

    //Display the name of the closest matching color in matchView
    matchView.innerHTML = colorList[closestColorIndex].name;

	//Move matchView to the event click-point, relative to the document.
    matchView.style.left = eventObj.pageX;
    matchView.style.top = eventObj.pageY;

    //Show matchView.
    matchView.style.display = "block";
}

