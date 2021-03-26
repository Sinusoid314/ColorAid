//Min/max values for the color regions
const orangeHueMin = 20;
const yellowHueMin = 50;
const greenHueMin = 70;
const tealHueMin = 160;
const blueHueMin = 190;
const purpleHueMin = 280;
const redHueMin = 350;
const graySatMax = 10;
const blackLumMax = 10;
const whiteLumMin = 90;

function Color(hue, sat, lum)
{
    this.hue = hue;
    this.sat = sat;
    this.lum = lum;

    this.setFromRGB = function(red, green, blue)
    //Convert the RGB components to the HSL components of this object
    {
        //
    }
}

function ColorRegion(name, min, max)
{
    this.name = name;
    this.min = min;
    this.max = max;

    this.containsColor = function(color)
    //Returns true if the given color is within this region, otherwise false
    {
		//Check along the hue axis
        if(this.max.hue < this.min.hue)
        {
		    //This deals with a region that wraps around the 0/360 degree hue boundary
            if((color.hue < this.min.hue) && (color.hue > this.max.hue))
            {
			    return false;
		    }
	    }
	    else
	    {
		    if((color.hue < this.min.hue) || (color.hue > this.max.hue))
		    {
			    return false;
		    }
		}

		//Check along the saturation axis
        if((color.sat < this.min.sat) || (color.sat > this.max.sat))
		{
            return false;
        }

        //Check along the luminance axis
        if((color.lum < this.min.lum) || (color.lum > this.max.lum))
		{
            return false;
        }

        return true;
    }
}

var colorRegionList =
    [
    new ColorRegion("orange", new Color(orangeHueMin, graySatMax + 1, blackLumMax + 1),
                              new Color(yellowHueMin - 1, 100, whiteLumMin - 1)),

    new ColorRegion("yellow", new Color(yellowHueMin, graySatMax + 1, blackLumMax + 1),
                              new Color(greenHueMin - 1, 100, whiteLumMin - 1)),

    new ColorRegion("green", new Color(greenHueMin, graySatMax + 1, blackLumMax + 1),
                             new Color(tealHueMin - 1, 100, whiteLumMin - 1)),

    new ColorRegion("teal", new Color(tealHueMin, graySatMax + 1, blackLumMax + 1),
                            new Color(blueHueMin - 1, 100, whiteLumMin - 1)),

    new ColorRegion("blue", new Color(blueHueMin, graySatMax + 1, blackLumMax + 1),
                            new Color(purpleHueMin - 1, 100, whiteLumMin - 1)),

    new ColorRegion("purple", new Color(purpleHueMin, graySatMax + 1, blackLumMax + 1),
                              new Color(redHueMin - 1, 100, whiteLumMin - 1)),

    new ColorRegion("red", new Color(redHueMin, graySatMax + 1, blackLumMax + 1),
                           new Color(orangeHueMin - 1, 100, whiteLumMin - 1)),

    new ColorRegion("gray", new Color(0, 0, blackLumMax + 1),
                            new Color(360, graySatMax, whiteLumMin - 1)),

    new ColorRegion("black", new Color(0, 0, 0),
                             new Color(360, 100, blackLumMax)),

    new ColorRegion("white", new Color(0, 0, whiteLumMin),
                             new Color(360, 100, 100))
    ];