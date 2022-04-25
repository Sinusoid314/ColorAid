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

class Color
{
  constructor(hue, sat, lum)
  {
    this.hue = hue;
    this.sat = sat;
    this.lum = lum;
  }

  setFromRGB(red, green, blue)
  //Convert the RGB components to the HSL components of this object
  {
    var cMin;
    var cMax;
    var delta;

    red /= 255;
    green /= 255;
    blue /= 255;

    cMin = Math.min(red, green, blue);
    cMax = Math.max(red, green, blue);
    delta = cMax - cMin;

    //Calculate hue
    if(delta == 0)
      this.hue = 0;
    else if(cMax == red)
      this.hue = ((green - blue) / delta) % 6;
    else if(cMax == green)
      this.hue = ((blue - red) / delta) + 2;
    else if(cMax == blue)
      this.hue = ((red - green) / delta) + 4;

    //Convert hue to degrees
    this.hue = Math.round(60 * this.hue);
    if(this.hue < 0)
      this.hue += 360;

    //Calculate luminance
    this.lum = (cMax + cMin) / 2;

    //Calculate saturation
    if(delta == 0)
      this.sat = 0;
    else
      this.sat = delta / (1 - Math.abs(2 * this.lum - 1));

    //Convert luminance and saturation to percentages
    this.sat = Math.round(this.sat * 100);
    this.lum = Math.round(this.lum * 100);
  }
}

class ColorRegion
{
  constructor(name, min, max)
  {
    this.name = name;
    this.min = min;
    this.max = max;
  }

  containsColor(color)
  //Returns true if the given color is within this region, otherwise false
  {
    //Check along the hue axis
    if(this.max.hue < this.min.hue)
    {
      //This deals with a region that wraps around the 0/360 degree hue boundary
      if((color.hue < this.min.hue) && (color.hue > this.max.hue))
        return false;
    }
    else
    {
      if((color.hue < this.min.hue) || (color.hue > this.max.hue))
        return false;
    }

    //Check along the saturation axis
    if((color.sat < this.min.sat) || (color.sat > this.max.sat))
      return false;

    //Check along the luminance axis
    if((color.lum < this.min.lum) || (color.lum > this.max.lum))
      return false;

    return true;
  }
}

var colorRegionList = [
        new ColorRegion("Orange", new Color(orangeHueMin, graySatMax + 1, blackLumMax + 1),
                                  new Color(yellowHueMin - 1, 100, whiteLumMin - 1)),

        new ColorRegion("Yellow", new Color(yellowHueMin, graySatMax + 1, blackLumMax + 1),
                                  new Color(greenHueMin - 1, 100, whiteLumMin - 1)),

        new ColorRegion("Green", new Color(greenHueMin, graySatMax + 1, blackLumMax + 1),
                                 new Color(tealHueMin - 1, 100, whiteLumMin - 1)),

        new ColorRegion("Teal", new Color(tealHueMin, graySatMax + 1, blackLumMax + 1),
                                new Color(blueHueMin - 1, 100, whiteLumMin - 1)),

        new ColorRegion("Blue", new Color(blueHueMin, graySatMax + 1, blackLumMax + 1),
                                new Color(purpleHueMin - 1, 100, whiteLumMin - 1)),

        new ColorRegion("Purple", new Color(purpleHueMin, graySatMax + 1, blackLumMax + 1),
                                  new Color(redHueMin - 1, 100, whiteLumMin - 1)),

        new ColorRegion("Red", new Color(redHueMin, graySatMax + 1, blackLumMax + 1),
                               new Color(orangeHueMin - 1, 100, whiteLumMin - 1)),

        new ColorRegion("Gray", new Color(0, 0, blackLumMax + 1),
                                new Color(360, graySatMax, whiteLumMin - 1)),

        new ColorRegion("Black", new Color(0, 0, 0),
                                 new Color(360, 100, blackLumMax)),

        new ColorRegion("White", new Color(0, 0, whiteLumMin),
                                 new Color(360, 100, 100))
   ];