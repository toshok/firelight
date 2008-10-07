function Point (x, y)
{
    this.x = x || 0;
    this.y = y || 0;
}

Point.prototype = {
    toString: function () {
	return this.x + "," + this.y;
    }
};
