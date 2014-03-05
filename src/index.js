// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var INDENT_TEXT = "  ";

exports.renderDiff = function(expected, actual) {
	if (exports.match(expected, actual)) return "";

	if (typeof actual === "object" || typeof expected === "object") return objectRenderDiff(expected, actual);
	else return flatRenderDiff(expected, actual);
};

function flatRenderDiff(expected, actual) {
	var renderedActual = exports.render(actual);
	var renderedExpected = exports.render(expected);

	if (typeof expected === "function" && typeof actual === "function") {
		if (renderedActual === renderedExpected) renderedExpected = "different " + renderedExpected;
	}

	return renderedActual + "   // expected " + renderedExpected;
}

function objectRenderDiff(expected, actual) {
	if (expected === null || actual === null) return flatRenderDiff(expected, actual);
	if (typeof expected !== "object") {
		return "// expected " + exports.render(expected) + " but got:\n" + INDENT_TEXT + renderWithIndent(INDENT_TEXT, actual);
	}
	if (typeof actual !== "object") {
		return exports.render(actual) + "   // expected:\n" + INDENT_TEXT + renderWithIndent(INDENT_TEXT, expected);
	}


	var expectedKeys = Object.getOwnPropertyNames(expected);
	var actualKeys = Object.getOwnPropertyNames(actual);

	var mismatchedProperties = expectedKeys.reduce(function(accumulated, key) {
		var diff = exports.renderDiff(expected[key], actual[key]);
		if (!diff) return accumulated;

		return accumulated + "\n" + INDENT_TEXT + key + ": " + diff;
	}, "");


	var extraKeys = actualKeys.filter(function(key) {
		return (!expected.hasOwnProperty(key));
	});
	var extraProperties = extraKeys.reduce(function(accumulated, key) {
		return accumulated + "\n" + INDENT_TEXT + INDENT_TEXT + key + ": " + exports.render(actual[key]);
	}, "");
	if (extraProperties) extraProperties = "\n" + INDENT_TEXT + "// extra properties:" + extraProperties;

	return "{" + mismatchedProperties + extraProperties + "\n}";
}

exports.render = function(obj) {
	return renderWithIndent("", obj);
};

function renderWithIndent(indent, obj) {
	if (Array.isArray(obj)) return arrayRender(indent, obj);
	else if (typeof obj === "object") return objectRender(indent, obj);
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