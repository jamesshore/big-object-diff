// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var INDENT_TEXT = "  ";

exports.renderDiff = function(expected, actual) {
	return renderDiffWithIndent("", expected, actual);
};

function renderDiffWithIndent(indent, expected, actual) {
	if (exports.match(expected, actual)) return "";

	var expectedIsArray = Array.isArray(expected);
	var actualIsArray = Array.isArray(actual);
	var expectedIsObject = (typeof expected === "object") && !expectedIsArray;
	var actualIsObject = (typeof actual === "object") && !actualIsArray;

	if (expectedIsArray && actualIsObject || expectedIsObject && actualIsArray) return flatRenderDiff(expected, actual);
	if (expectedIsArray || actualIsArray) return arrayRenderDiff(indent, expected, actual);
	if (actualIsObject || expectedIsObject) return objectRenderDiff(indent, expected, actual);
	else return flatRenderDiff(expected, actual);
}

function flatRenderDiff(expected, actual) {
	var renderedActual = flatRender(actual);
	var renderedExpected = flatRender(expected);

	if (typeof expected === "function" && typeof actual === "function") {
		if (renderedActual === renderedExpected) renderedExpected = "different " + renderedExpected;
	}

	return renderedActual + "   // expected " + renderedExpected;
}

function arrayRenderDiff(oldIndent, expected, actual) {
	var indent = oldIndent + INDENT_TEXT;

	if (!Array.isArray(expected)) {
		if (actual.length === 0) return flatRenderDiff(expected, actual);
		return "// expected " + exports.render(expected) + " but got:\n" + indent + renderWithIndent(indent, actual);
	}
	if (!Array.isArray(actual)) {
		if (expected.length === 0) return flatRenderDiff(expected, actual);
		return exports.render(actual) + "   // expected:\n" + indent + renderWithIndent(indent, expected);
	}

	return "[" + renderPropertiesDiff(oldIndent, expected, actual, true) + "\n" + oldIndent + "]";
}

function objectRenderDiff(oldIndent, expected, actual) {
	var indent = oldIndent + INDENT_TEXT;

	if (expected === null || actual === null) return flatRenderDiff(expected, actual);
	if (typeof expected !== "object" && !Array.isArray(expected)) return flatRenderDiff(expected, actual);
	if (typeof expected !== "object" || Array.isArray(expected)) {
		if (Object.getOwnPropertyNames(actual).length === 0) return flatRenderDiff(expected, actual);
		return "// expected " + exports.render(expected) + " but got:\n" + indent + renderWithIndent(indent, actual);
	}
	if (typeof actual !== "object" && !Array.isArray(actual)) return flatRenderDiff(expected, actual);
	if (typeof actual !== "object" || Array.isArray(actual)) {
		if (Object.getOwnPropertyNames(expected).length === 0) return flatRenderDiff(expected, actual);
		return exports.render(actual) + "   // expected:\n" + indent + renderWithIndent(indent, expected);
	}

	return "{" + renderPropertiesDiff(oldIndent, expected, actual, false) + "\n" + oldIndent + "}";
}

function renderPropertiesDiff(oldIndent, expected, actual, ignoreLengthProperty) {
	var indent = oldIndent + INDENT_TEXT;

	var unionKeys = [];
	var extraKeys = [];
	var missingKeys = [];

	analyzeKeys();
	return incorrectProperties() + missingProperties() + extraProperties() + mismatchedPrototype();

	function analyzeKeys() {
		var expectedKeys = Object.getOwnPropertyNames(expected);
		var actualKeys = Object.getOwnPropertyNames(actual);

		expectedKeys.forEach(function(key) {
			if (actual.hasOwnProperty(key)) unionKeys.push(key);
			else missingKeys.push(key);
		});
		extraKeys = actualKeys.filter(function(key) {
			return (!expected.hasOwnProperty(key));
		});
	}

	function incorrectProperties() {
		return unionKeys.reduce(function(accumulated, key) {
			if (ignoreLengthProperty && key === "length") return accumulated;

			var diff = renderDiffWithIndent(indent, expected[key], actual[key]);
			if (!diff) return accumulated;

			return accumulated + "\n" + indent + key + ": " + diff;
		}, "");
	}

	function missingProperties() {
		return propertyBlock(expected, missingKeys, "missing properties");
	}

	function extraProperties() {
		return propertyBlock(actual, extraKeys, "extra properties");
	}

	function propertyBlock(obj, keys, title) {
		if (keys.length === 0) return "";
		return "\n" + indent + "// " + title + ":" + renderProperties(oldIndent, obj, keys, false, true);
	}

	function mismatchedPrototype() {
		var expectedProto = Object.getPrototypeOf(expected);
		var actualProto = Object.getPrototypeOf(actual);

		if (expectedProto !== actualProto) return "\n" + indent + "// objects have different prototypes";
		else return "";
	}

}

exports.render = function(obj) {
	return renderWithIndent("", obj, false);
};

function renderWithIndent(indent, obj, collapseObjects) {
	if (collapseObjects) return flatRender(obj);
	else if (Array.isArray(obj)) return arrayRender(indent, obj);
	else if (typeof obj === "object") return objectRender(indent, obj);
	else return flatRender(obj);
}

function flatRender(obj) {
	if (obj === undefined) return "undefined";
	if (obj === null) return "null";
	if (typeof obj === "string") return JSON.stringify(obj);
	if (Array.isArray(obj)) {
		if (obj.length === 0) return "[]";
		return "[...]";
	}
	if (typeof obj === "object") {
		if (Object.getOwnPropertyNames(obj).length === 0) return "{}";
		else return "{...}";
	}
	if (typeof obj === "function") {
		if (!obj.name) return "<anon>()";
		else return obj.name + "()";
	}

	return obj.toString();
}

function arrayRender(indent, obj) {
	if (obj.length === 0) return "[]";

	var properties = renderProperties(indent, obj, Object.getOwnPropertyNames(obj), true, false);
	return "[" + properties + "\n" + indent + "]";
}

function objectRender(indent, obj) {
	if (obj === null) return "null";
	if (Object.getOwnPropertyNames(obj).length === 0) return "{}";

	var properties = renderProperties(indent, obj, Object.getOwnPropertyNames(obj), false, false);
	return "{" + properties + "\n" + indent + "}";
}

function renderProperties(indent, obj, keys, ignoreLengthProperty, collapseObjects) {
	var newIndent = indent + INDENT_TEXT;
	var properties = keys.reduce(function(accumulated, key) {
		if (ignoreLengthProperty && key === "length") return accumulated;
		return accumulated + "\n" + newIndent + key + ": " + renderWithIndent(newIndent, obj[key], collapseObjects);
	}, "");
	return properties;
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
	if (b === null) return a === null;

	if (!exports.match(Object.getPrototypeOf(a), Object.getPrototypeOf(b))) return false;

	var aKeys = Object.getOwnPropertyNames(a);
	var bKeys = Object.getOwnPropertyNames(b);
	if (aKeys.length !== bKeys.length) return false;

	return aKeys.every(function(key) {
		return exports.match(a[key], b[key]);
	});
}