// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

exports.render = function(obj) {
	if (typeof obj === "object") return objectRender(obj);
	else return flatRender(obj);
};

function flatRender(obj) {
	if (obj === undefined) return "undefined";
	if (typeof obj === "string") return JSON.stringify(obj);
	if (typeof obj === "function") {
		if (!obj.name) return "<anon>()";
		else return obj.name + "()";
	}

	return obj.toString();
}

function objectRender(obj) {
	if (obj === null) return "null";

	var keys = Object.getOwnPropertyNames(obj);
	if (keys.length === 0) return "{}";

	var properties = keys.reduce(function(accumulated, key) {
		return accumulated + "\n  " + key + ": " + exports.render(obj[key]);
	}, "");
	return "{" + properties + "\n}";
}

exports.match = function(a, b) {
	if (typeof a === "object" && typeof b === "object") return objectMatch(a, b);
	else return flatMatch(a, b);
};

function flatMatch(a, b) {
	if (typeof a === "number" && isNaN(a)) return isNaN(b);

	return a === b;
}

function objectMatch(a, b) {
	if (a === b) return true;
	if (a === null) return b === null;

	if (!exports.match(Object.getPrototypeOf(a), Object.getPrototypeOf(b))) return false;

	var aKeys = Object.getOwnPropertyNames(a);
	var bKeys = Object.getOwnPropertyNames(b);
	if (aKeys.length !== bKeys.length) return false;

	return aKeys.every(function(key) {
		return exports.match(a[key], b[key]);
	});
}