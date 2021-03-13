function ColorPoint(cpName, cpRed, cpGreen, cpBlue)
{
    this.cpName = cpName;
    this.cpRed = cpRed;
    this.cpGreen = cpGreen;
    this.cpBlue = cpBlue;
}

//List of predefined colors
var preDefColorList = [
                       new ColorPoint("Black", 0, 0, 0),
                       new ColorPoint("White", 255, 255, 255),
                       new ColorPoint("Red", 255, 0, 0),
                       //new ColorPoint("Light Red", 0, 0, 0),
                       new ColorPoint("Dark Red", 139, 0, 0),
                       new ColorPoint("Green", 0, 128, 0),
                       new ColorPoint("Light Green", 144, 238, 144),
                       new ColorPoint("Dark Green", 0, 100, 0),
                       new ColorPoint("Blue", 0, 0, 255),
                       new ColorPoint("Light Blue", 173, 216, 230),
                       new ColorPoint("Dark Blue", 0, 0, 139),
                       //new ColorPoint("Orange", 0, 0, 0),
                       //new ColorPoint("", 0, 0, 0),
                       //new ColorPoint("", 0, 0, 0),
                       new ColorPoint("Yellow", 255, 255, 0),
                       new ColorPoint("Light Yellow", 255, 255, 224),
                       //new ColorPoint("Dark Yellow", 0, 0, 0),
                       //new ColorPoint("Purple", 0, 0, 0),
                       //new ColorPoint("", 0, 0, 0),
                       //new ColorPoint("", 0, 0, 0),
                       //new ColorPoint("Grey", 0, 0, 0),
                       //new ColorPoint("", 0, 0, 0),
                       //new ColorPoint("", 0, 0, 0),
                       new ColorPoint("Brown", 165, 42, 42),
                       //new ColorPoint("Light Brown", 0, 0, 0),
                       //new ColorPoint("Dark Brown", 0, 0, 0),
                       //new ColorPoint("Pink", 0, 0, 0),
                       //new ColorPoint("", 0, 0, 0),
                       //new ColorPoint("", 0, 0, 0),
                       new ColorPoint("Teal", 0, 128, 128),
                       //new ColorPoint("", 0, 0, 0)
                      ];

//Define interface variables
var cameraBtn = document.getElementById("cameraBtn");
var snapshotBtn = document.getElementById("snapshotBtn");
var cameraView = document.getElementById("cameraView");
var snapshotView = document.getElementById("snapshotView");
var snapshotContext = snapshotView.getContext("2d");
var matchView = document.getElementById("matchView");

if(initCamera)
{
	//Set events
    cameraBtn.addEventListener("click", cameraBtn_OnClick);
    cameraBtn.addEventListener("tap", cameraBtn_OnClick);
    snapshotBtn.addEventListener("click", snapshotBtn_OnClick);
    snapshotBtn.addEventListener("tap", snapshotBtn_OnClick);
    cameraView.addEventListener("click", cameraView_OnClick);
    cameraView.addEventListener("tap", cameraView_OnClick);
    snapshotView.addEventListener("click", snapshotView_OnClick);
    snapshotView.addEventListener("tap", snapshotView_OnClick);
}

function initCamera()
{
    if('mediaDevices' in navigator)
    {
        navigator.mediaDevices.getUserMedia({ video: true })
        .then((mediaStream) =>
              {
                  cameraView.srcObject = mediaStream;
                  cameraView.play();
                  retVal = true;
              })
		.catch((err) =>
               {
                   alert("Unable to access camera: " + err);
                   retVal = false;
               });
    }
    else
    {
        alert("Your browser does not support media devices.");
        retVal = false;
    }
    return retVal;
}

function cameraBtn_OnClick(eventObj)
{
    //Show cameraView
    cameraView.style.display = "block";

    //Hide snapshotView
	snapshotView.style.display = "none";
    matchView.style.display = "none";

	//Highlight cameraBtn
	cameraBtn.style.backgroundColor = "black";
	cameraBtn.style.color = "white";

	//De-highlight snapshotBtn
	snapshotBtn.style.backgroundColor = "white";
    snapshotBtn.style.color = "black";
}

function snapshotBtn_OnClick(eventObj)
{
    //Show snapshotView
    snapshotView.style.display = "block";
    //matchView.style.display = "block";

    //Hide cameraView
	cameraView.style.display = "none";

	//Highlight snapshotBtn
	snapshotBtn.style.backgroundColor = "black";
	snapshotBtn.style.color = "white";

	//De-highlight cameraBtn
	cameraBtn.style.backgroundColor = "white";
    cameraBtn.style.color = "black";
}

function cameraView_OnClick(eventObj)
{
    //Copy image from cameraView to snapshotView
    snapshotContext.drawImage(cameraView, 0, 0);

    //Switch to snapshotTab
    snapshotBtn_OnClick();
}

function snapshotView_OnClick(eventObj)
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
    for(var listIndex=0; listIndex < preDefColorList.length; listIndex++)
    {
        //Set testDistance to the distance between sampleColor and the current preDefColorList item
        //(the square-root in the distance formula is ommitted to simplify calculation)
        testDistance = Math.pow(preDefColorList[listIndex].cpRed - sampleColor[0], 2)
			         + Math.pow(preDefColorList[listIndex].cpGreen - sampleColor[1], 2)
			         + Math.pow(preDefColorList[listIndex].cpBlue - sampleColor[2], 2);

        if((listIndex == 0) || (testDistance < closestDistance))
        {
            closestDistance = testDistance;
            closestColorIndex = listIndex;
	    }
    }

    //Display the name of the closest matching color in matchView
    matchView.innerHTML = preDefColorList[closestColorIndex].cpName;

	//Move matchView to the event click-point, relative to the document.
    matchView.style.left = eventObj.pageX;
    matchView.style.top = eventObj.pageY;

    //Show matchView.
    matchView.style.display = "block";
}

