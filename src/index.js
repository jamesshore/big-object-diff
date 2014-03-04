// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var INDENT_TEXT = "  ";

exports.renderDiff = function(expected, actual) {
	if (exports.match(expected, actual)) return "";

	return render(actual) + "   // expected " + render(expected);
};

var render = exports.render = function(obj) {
	return renderWithIndent("", obj);
};

function renderWithIndent(indent, obj) {
	if (Array.isArray(obj)) return arrayRender(indent, obj);
	if (typeof obj === "object") return objectRender(indent, obj);
	else return flatRender(obj);
}

function flatRender(obj) {
	if (obj === undefined) return "undefined";
	if (typeof obj === "string") return JSON.stringify(obj);
	if (typeof obj === "function") {
		if (!obj.name) return "<anon>()";
		else return obj.name + "()";
	}

	return obj.toString();
}
function arrayRender(indent, obj) {
	if (obj.length === 0) return "[]";

	return "[" + renderProperties(indent, obj, true) + "]";
}

function objectRender(indent, obj) {
	if (obj === null) return "null";
	if (Object.getOwnPropertyNames(obj).length === 0) return "{}";

	return "{" + renderProperties(indent, obj, false) + "}";
}

function renderProperties(indent, obj, ignoreLengthProperty) {
	var newIndent = indent + INDENT_TEXT;
	var keys = Object.getOwnPropertyNames(obj);
	var properties = keys.reduce(function(accumulated, key) {
		if (ignoreLengthProperty && key === "length") return accumulated;
		return accumulated + "\n" + newIndent + key + ": " + renderWithIndent(newIndent, obj[key]);
	}, "");
	return properties + "\n" + indent;
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