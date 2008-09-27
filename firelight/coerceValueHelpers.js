function validateEnum (e, v) {
  if (typeof (v) != "string")
    throw new Error ("invalid '" + e + "' value '" + v + "'.");

  var vs = new String(v);
  for (var i in e) {
    if (typeof (v) == "string" && v.toLower() == i.toLower())
      return;
  }

  throw new Error ("invalid '" + e + "' value '" + v + "'.");
}

function coerceValueToBrush (v)
{
  if (typeof (v) == "string") {
    return new SolidColorBrush (v);
  }
  else {
    Trace.error ("FIXME: returning object unmolested in coerceValueToBrush");
    return v;
  }
  //throw "value '" + v + "' is invalid for this property";
}

function coerceValueToPoint (v)
{
  if (typeof (v) == "string") {
    var ps = v.split (',');
    Trace.debug ("creating new Point (" + ps[0] + ", " + ps[1] + ")");
    return new Point (ps[0], ps[1]);
  }
  else if (typeof (v.x) == "number" &&
	   typeof (v.y) == "number") {
    return v;
  }
  throw new Error ("don't know how to convert '" + v + "' to a point");
}

function coerceValueToDuration (v) {
  if (typeof (v) == "string") {
    return Duration.parse (v);
  }
  throw new Error ("don't know how to convert '" + v + "' to a duration");
}

function coerceValueToFillBehavior (v)
{
  validateEnum (FillBehavior, v);
}

function coerceValueToRect (v)
{
  if (typeof (v.left) == "number" &&
      typeof (v.top) == "number" &&
      typeof (v.width) == "number" &&
      typeof (v.height) == "number")
    return v;
  throw new Error ("don't know how to convert '" + v + "' to a rectangle");
}