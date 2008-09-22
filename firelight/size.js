function Size (w, h)
{
    this.width = w || 0;
    this.height = h || 0;
}

Size.prototype = {
    isEmpty: function () {
	return (this.width == -Infinity && this.height == -Infinity);
    },

    max: function (size) {
	return new Size (this.width < size.width ? size.width : this.width, this.height < size.height ? size.height : this.height);
    },

    min: function (size) {
	return new Size (this.width > size.width ? size.width : this.width, this.height > size.height ? size.height : this.height);
    },

    growBy: function (w, h) {
	if (typeof (h) == "undefined") {
	    // treat w like a thickness.
	    var t = w;
	    w = this.width + (t.left || 0) + (t.right || 0);
	    h = this.height + (t.top || 0) + ( t.bottom || 0);
	    return new Size (w > 0 ? w : 0, h > 0 ? h : 0);
	}
	else {
	    return new Size (w + this.width, h + this.height);
	}
    },

    shrinkBy: function (w, h) {
	if (typeof (h) == "undefined") {
	    // treat w like a thickness.
	    return this.growBy ({left: -w.left, top: -w.top, right: -w.right, bottom: -w.bottom});
	}
	else {
	    return new Size (this.width - w, this.height - h);
	}
    },

    toString: function () {
	return this.width + "," + this.height;
    }
};