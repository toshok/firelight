TARGET_DEBUG=firelight-debug.js

JS_SOURCES=	consts.js			\
		misc.js				\
		binding.js			\
		fillbehavior.js			\
		repeatbehavior.js		\
		timespan.js			\
		timespan.js			\
		duration.js			\
		coerceValueHelpers.js		\
		xamltyperesolver.js		\
		xamlreader.js			\
		dependencyproperty.js		\
		dependencyobject.js		\
		namescope.js			\
		collection.js			\
		resourcedictionary.js		\
		triggeractioncollection.js	\
		eventtrigger.js			\
		triggercollection.js		\
		transformcollection.js		\
		transform.js			\
		rotatetransform.js		\
		scaletransform.js		\
		translatetransform.js		\
		transformgroup.js		\
		uielement.js			\
		frameworkelement.js		\
		point.js			\
		rect.js				\
		size.js				\
		brush.js			\
		solidcolorbrush.js		\
		gradientbrush.js		\
		gradientstop.js			\
		lineargradientbrush.js		\
		uielementcollection.js		\
		gradientstopcollection.js	\
		inline.js			\
		linebreak.js			\
		run.js				\
		inlinecollection.js		\
		textblock.js			\
		panel.js			\
		canvas.js			\
		shape.js			\
		rectangle.js			\
		timeline.js			\
		timelinecollection.js		\
		timelinegroup.js		\
		doubleanimation.js		\
		storyboard.js			\
		beginstoryboard.js		\
		animationmanager.js		\
		layoutinformation.js		\
		layoutmanager.js		\
		setter.js			\
		svghost.js

$(TARGET_DEBUG)-stamp: $(JS_SOURCES)
	cat $(JS_SOURCES) > $(TARGET_DEBUG)
	touch $(TARGET_DEBUG)-stamp