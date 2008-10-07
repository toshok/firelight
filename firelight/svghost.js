function SvgHost ()
{
  var defaultTick = 50;


  this.root = null;
  this.rootVisual = null;

  this.animationManager = new AnimationManager ();
  this.layoutManager = new LayoutManager ();
  this.globalTick = defaultTick;
  this.intervalId = null;

  if (arguments && arguments[0]) {
    var args = arguments[0];
    if ("domElement" in args)
      this.setDOMElement (args.domElement);

    if ("rootVisual" in args)
      this.setRootVisual (args.rootVisual);

    if ("globalTick" in args) {
      this.globalTick = parseInt (args.globalTick);
      if (isNaN (this.globalTick)
	  this.globalTick = defaultTick;
    }
  }
}

SvgHost.prototype = {
  setDOMElement: function (el) {
    this.root = el;

    this.content = document.createElementNS (FirelightConsts.SVGns, "g");
    this.defs = document.createElementNS (FirelightConsts.SVGns, "defs");

    this.content.appendChild (this.defs);

    this.root.appendChild (this.content);
  },

  setRootVisual: function (v) {
    if (this.rootVisual)
      this.rootVisual.disconnectHost();

      this.rootVisual = v;

      if (this.rootVisual) {
	// now iterate over the tree, creating peers
	var rootPeer = this.rootVisual.createPeer (this);

	// let all the nodes in the hierarchy know about the host
	this.rootVisual.connectHost (this);

	// and add it to the dom
	this.content.appendChild (rootPeer);

	// measure/arrange.  this should likely be done someplace
	// else (or possibly in a timeout).

	// XXX these should be the width/height of the dom element
	this.rootVisual.measure (new Size (500, 500));

	this.rootVisual.arrange (new Rect (0, 0, this.rootVisual.desiredSize.width, this.rootVisual.desiredSize.height));

	// dump the svg structure to the console
	var serializer = new XMLSerializer( );
	var str = serializer.serializeToString( this.root );
	if (typeof (XML) != "undefined") {
	  var pretty = XML( str ).toXMLString( );
	  console.log (pretty);
	}
	else
	  console.log (str);
      }

      // just for testing - makes it easier to access the rootVisual
      window["rootVisual"] = v;
  },

  startClock: function () {
    if (this.intervalId == null) {
      var that = this;
      Trace.debug ("starting clock");
      this.intervalId = setInterval (function (ms_late) { that.globalClockTick (ms_late); }, this.globalTick);
    }
  },

  stopClock: function () {
    if (this.intervalId != null) {
      clearInterval (this.intervalId);
      this.intervalId = null;
    }
  },

  globalClockTick: function (ms_late) {
    Trace.debug ("global clock ticking");
    this.animationManager.processAnimations ();
    this.layoutManager.processPendingMeasureAndArrange ();
    this.maybeStopClock ();
  },

  addMeasure: function (el) {
    this.layoutManager.addMeasure (el);
    this.startClock ();
  },

  addArrange: function (el) {
    this.layoutManager.addArrange (el);
    this.startClock ();
  },

  removeMeasure: function (el) {
    this.layoutManager.removeMeasure (el);
  },

  removeArrange: function (el) {
    this.layoutManager.removeArrange (el);
  },

  addTimeline: function (tl) {
    this.animationManager.addTimeline (tl);
    this.startClock ();
  },

  removeTimeline: function (tl) {
    this.animationManager.removeTimeline (tl);
  },

  maybeStopClock: function () {
    if (this.intervalId != -1 &&
	!this.layoutManager.needClock() &&
	!this.animationManager.needClock()){
      console.log ("stopping global clock");
      this.stopClock ();
    }
//    else {
//      if (this.layoutManager.needClock ())
//	console.log ("layout manager needs the clock");
//      if (this.animationManager.needClock ())
//	console.log ("animation manager needs the clock");
//    }
  }
};
