function Rect (l, t, w, h)
{
    this.left = l || 0;
    this.top = t || 0;
    this.width = w || 0;
    this.height = h || 0;
}

Rect.prototype = {
    pointInside: function (px, py) {
	return px > this.left && px < (this.left + this.width) && py > this.top && py < (this.top + this.height);
    },

    intersectsWith: function (rect) {
	return ((this.left < rect.left + rect.width) && (this.left + this.width > rect.left) &&
		(this.top < rect.top + rect.height) && (this.top + this.height > rect.top));
    },

    // moonlight has a bool parameter here, and a bool parameter to
    // union to deal with logical bounds.  we're going to
    // intentionally ignore that for firelight (at least for now.)
    isEmpty: function () {
	return ((this.width <= 0.0) || (this.height <= 0.0));
    },

    union: function (rect) {
	if (this.IsEmpty ())
	    return new Rect (rect.left, rect.top, rect.width, rect.height);
	if (rect.isEmpty ())
	    return new Rect (this.left, this.top, this.width, this.height);

	var result = new Rect ();
	result.left = this.left < rect.left ? left : rect.left;
	result.top = this.top < rect.top ? this.top : rect.top;
	result.width = ((this.left + width > rect.left + rect.width) ? (this.left + width) : (rect.left + rect.width)) - result.left;
	result.height = ((this.top + height > rect.top + rect.height) ? (this.top + height) : (rect.top + rect.height)) - result.top;
	return result;
    },

    roundOut: function () {
	return new Rect (Math.floor (this.left),
			 Math.floor (this.top),
			 Math.ceil (this.left + this.width) - Math.floor (this.left),
			 Math.ceil (this.top + this.height) - Math.floor (this.top));
    },

    roundIn: function () {
	return new Rect (Math.ceil (this.left),
			 Math.ceil (this.top),
			 Math.floor (this.left + this.width) - Math.ceil (this.left),
			 Math.floor (this.top + this.height) - Math.ceil (this.top));
    },

    toString: function () {
	return left + "," + top + "," + width + "," + height;
    },
};