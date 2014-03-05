// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var INDENT_TEXT = "  ";

exports.renderDiff = function(expected, actual) {
	return renderDiffWithIndent("", expected, actual);
};

function renderDiffWithIndent(indent, expected, actual) {
	if (exports.match(expected, actual)) return "";

	if (Array.isArray(expected) || Array.isArray(actual)) return arrayRenderDiff(indent, expected, actual);
	if (typeof actual === "object" || typeof expected === "object") return objectRenderDiff(indent, expected, actual);
	else return flatRenderDiff(expected, actual);
}

function flatRenderDiff(expected, actual) {
	var renderedActual = exports.render(actual);
	var renderedExpected = exports.render(expected);

	if (typeof expected === "function" && typeof actual === "function") {
		if (renderedActual === renderedExpected) renderedExpected = "different " + renderedExpected;
	}

	return renderedActual + "   // expected " + renderedExpected;
}

function arrayRenderDiff(oldIndent, expected, actual) {
	var indent = oldIndent + INDENT_TEXT;

	if (!Array.isArray(expected)) {
		if (actual.length === 0) {
			if (typeof expected === "object") return objectRenderDiff(oldIndent, expected, actual);
			return flatRenderDiff(expected, actual);
		}
		return "// expected " + exports.render(expected) + " but got:\n" + indent + renderWithIndent(indent, actual);
	}
	if (!Array.isArray(actual)) {
		if (expected.length === 0) {
			if (typeof actual === "object") return objectRenderDiff(oldIndent, expected, actual);
			return flatRenderDiff(expected, actual);
		}
		return exports.render(actual) + "   // expected:\n" + indent + renderWithIndent(indent, expected);
	}

	return "[" + renderPropertiesDiff(oldIndent, expected, actual, true) + "\n" + oldIndent + "]";
}

function objectRenderDiff(oldIndent, expected, actual) {
	var indent = oldIndent + INDENT_TEXT;

	if (expected === null || actual === null) return flatRenderDiff(expected, actual);
	if (typeof expected !== "object" || Array.isArray(expected)) {
		if (Object.getOwnPropertyNames(actual).length === 0) return flatRenderDiff(expected, actual);
		return "// expected " + exports.render(expected) + " but got:\n" + indent + renderWithIndent(indent, actual);
	}
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
	return incorrectProperties() + missingProperties() + extraProperties();

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
		return "\n" + indent + "// " + title + ":" + renderProperties(oldIndent, obj, keys, false);
	}

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

	var properties = renderProperties(indent, obj, Object.getOwnPropertyNames(obj), true);
	return "[" + properties + "\n" + indent + "]";
}

function objectRender(indent, obj) {
	if (obj === null) return "null";
	if (Object.getOwnPropertyNames(obj).length === 0) return "{}";

	var properties = renderProperties(indent, obj, Object.getOwnPropertyNames(obj), false);
	return "{" + properties + "\n" + indent + "}";
}

function renderProperties(indent, obj, keys, ignoreLengthProperty) {
	var newIndent = indent + INDENT_TEXT;
	var properties = keys.reduce(function(accumulated, key) {
		if (ignoreLengthProperty && key === "length") return accumulated;
		return accumulated + "\n" + newIndent + key + ": " + renderWithIndent(newIndent, obj[key]);
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