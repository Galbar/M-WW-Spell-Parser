/**
Explores the HTML node tree.
**/
'use strict';
function Explorer(baseCaseComp, baseCaseCallback, recursiveCaseCallback) {
	if (baseCaseComp === undefined)
		this.baseComp = function (e) {return false};
	else
		this.baseComp = baseCaseComp;
	if (baseCaseCallback === undefined)
		this.baseCallback = function (e) {};
	else
		this.baseCallback = baseCaseCallback;
	if (recursiveCaseCallback === undefined)
		this.recursiveCallback = function (e) {};
	else
		this.recursiveCallback = recursiveCaseCallback;
}

Explorer.prototype.explore = function (e) {
	if (this.baseComp(e)) {
		this.baseCallback(e);
	}
	else {
		this.recursiveCallback(e)
		for (var i = 0; i < e.childNodes.length; i++) {
			this.explore(e.childNodes[i]);
		};
	}
}
