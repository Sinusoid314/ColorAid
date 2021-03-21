function colorItem(name, red, green, blue)
{
    this.name = name;
    this.red = red;
    this.green = green;
    this.blue = blue;
}

var colorList = [
                 new colorItem("Black", 0, 0, 0),
                 new colorItem("White", 255, 255, 255),

                 new colorItem("Dark Red", 75, 0, 0),
                 new colorItem("Red", 165, 0, 0),
                 new colorItem("Light Red", 255, 0, 0),

                 new colorItem("Dark Green", 0, 75, 0),
                 new colorItem("Green", 0, 165, 0),
                 new colorItem("Light Green", 0, 255, 0),

                 new colorItem("Dark Blue", 0, 0, 75),
			     new colorItem("Blue", 0, 0, 165),
                 new colorItem("Light Blue", 0, 0, 255),

                 //new colorItem("Dark Orange", 0, 0, 0),
                 //new colorItem("Orange", 0, 0, 0),
                 //new colorItem("Light Orange", 0, 0, 0),

                 new colorItem("Dark Yellow", 165, 165, 0),
                 new colorItem("Yellow", 255, 255, 0),
                 new colorItem("Light Yellow", 255, 255, 75),

                 //new colorItem("Dark Purple", 0, 0, 0),
                 //new colorItem("Purple", 0, 0, 0),
                 //new colorItem("Light Purple", 0, 0, 0),

                 //new colorItem("Dark Gray", 0, 0, 0),
                 //new colorItem("Gray", 0, 0, 0),
                 //new colorItem("Light Gray", 0, 0, 0),

                 new colorItem("Dark Brown", 100, 60, 0),
                 new colorItem("Brown", 150, 90, 0),
                 new colorItem("Light Brown", 180, 100, 0),

                 //new colorItem("Dark Pink", 0, 0, 0),
                 //new colorItem("Pink", 0, 0, 0),
                 //new colorItem("Light Pink", 0, 0, 0),

                 //new colorItem("Dark Teal", 0, 0, 0),
                 new colorItem("Teal", 0, 128, 128),
                 //new colorItem("Light Teal", 0, 0, 0)
                ];
