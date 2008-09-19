
function coerceValueToBrush (v)
{
    if (typeof (v) == "string") {
	return new SolidColorBrush (v);
    }
    else {
	console.log ("returning object in coerceValueToBrush");
	return v;
    }
    //throw "value '" + v + "' is invalid for this property";
}

function coerceValueToPoint (v)
{
    if (typeof (v) == "string") {
	var ps = v.split (',');
	console.log ("creating new Point (" + ps[0] + ", " + ps[1] + ")");
	return new Point (ps[0], ps[1]);
    }
    throw new Error ("don't know how to convert '" + v + "' to a point");
}
