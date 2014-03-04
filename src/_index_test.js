// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var expect = require("expect.js");
var diff = require("./index.js");

describe("compares flat types:", function() {
	it("undefined", function() {
		expect(diff.match(undefined, undefined)).to.be(true);
		expect(diff.match(undefined, null)).to.be(false);
	});

	it("null", function() {
		expect(diff.match(null, null)).to.be(true);
		expect(diff.match(null, undefined)).to.be(false);
		expect(diff.match(null, {})).to.be(false);
	});

	it("boolean", function() {
		expect(diff.match(true, true)).to.be(true);
		expect(diff.match(false, false)).to.be(true);

		expect(diff.match(false, true)).to.be(false);
		expect(diff.match(true, false)).to.be(false);

		expect(diff.match(true, 1)).to.be(false);
	});

	it("string", function() {
		expect(diff.match("", "")).to.be(true);
		expect(diff.match("foo", "foo")).to.be(true);

		expect(diff.match("foo", "foo ")).to.be(false);
	});

	it("number", function() {
		expect(diff.match(0, 0)).to.be(true);
		expect(diff.match(NaN, NaN)).to.be(true);

		expect(diff.match(0, 1)).to.be(false);
		expect(diff.match(0, NaN)).to.be(false);
		expect(diff.match(NaN, 0)).to.be(false);
	});

	it("function", function() {
		expect(diff.match(a, a)).to.be(true);
		expect(diff.match(a, b)).to.be(false);

		function a() {}
		function b() {}
	});
});

describe("compares objects:", function() {
	it("identical", function() {
		var a = { a: 1 };
		expect(diff.match(a, a)).to.be(true);
	});

	it("empty", function() {
		expect(diff.match({}, {})).to.be(true);
	});

	it("same keys", function() {
		expect(diff.match({ a: 1, b: 2 }, { a: 1, b: 2 })).to.be(true);
		expect(diff.match({ a: 1, b: 2 }, { a: 1, b: "X" })).to.be(false);
	});

	it("different keys", function() {
		expect(diff.match({ a: 1 }, { b: 1 })).to.be(false);
	});

	it("different sizes", function() {
		expect(diff.match({ a: 1, b: 2}, { a: 1, b: 2, c: 3 })).to.be(false);
		expect(diff.match({ a: 1, b: 2}, { a: 1 })).to.be(false);
	});

	it("nested", function() {
		expect(diff.match(
			{ a: 1, b: { b1: { b1a: "2" } }},
			{ a: 1, b: { b1: { b1a: "2" } }}
		)).to.be(true);

		expect(diff.match(
			{ a: 1, b: { b1: { b1a: "2" } }},
			{ a: 1, b: { b1: { b1a: "X" } }}
		)).to.be(false);
	});

	it("with prototype", function() {
		var protoA1 = { p: 1 };
		var protoA2 = { p: 1 };
		var protoB = { p: "X" };

		var a1 = Object.create(protoA1);
		var a2 = Object.create(protoA2);
		var b = Object.create(protoB);

		expect(diff.match(a1, a2)).to.be(true);
		expect(diff.match(a1, b)).to.be(false);
	});

	it("without prototype", function() {
		var a1 = Object.create(null);
		var a2 = Object.create(null);
		var b = Object.create(null);
		b.a = "X";

		expect(diff.match(a1, a2)).to.be(true);
		expect(diff.match(a1, b)).to.be(false);
	});
});

describe("compares arrays:", function() {
	it("empty", function() {
		expect(diff.match([], [])).to.be(true);
	});

	it("same size", function() {
		expect(diff.match([ 1, 2, 3 ], [ 1, 2, 3 ] )).to.be(true);
		expect(diff.match([ 1, 2, 3 ], [ 1, "X", 3 ] )).to.be(false);
	});

	it("different sizes", function() {
		expect(diff.match([ 1, 2 ], [ 1, 2, 3] )).to.be(false);
		expect(diff.match([ 1, 2 ], [ 1 ] )).to.be(false);
	});

	it("nested", function() {
		expect(diff.match(
			[ 1, [ "a", "b", [ 3, 4, 5 ] ]],
			[ 1, [ "a", "b", [ 3, 4, 5 ] ]]
		)).to.be(true);

		expect(diff.match(
			[ 1, [ "a", "b", [ 3, 4, 5 ] ]],
			[ 1, [ "a", "b", [ 3, 4, "X" ] ]]
		)).to.be(false);
	});

	it("mixed with objects", function() {
		expect(diff.match(
			[ 1, { a: [ 2, 3 ] }],
			[ 1, { a: [ 2, 3 ] }]
		)).to.be(true);

		expect(diff.match(
			[ 1, { a: [ 2, 3 ] }],
			[ 1, { a: [ 2, "X" ] }]
		)).to.be(false);
	});

	it("sparse", function() {
		var a = [];
		var b = [];

		a[3000] = "1";
		b[3000] = "1";
		expect(diff.match(a, b)).to.be(true);

		b[3000] = "X";
		expect(diff.match(a, b)).to.be(false);

		b = [];
		b[10] = "1";
		expect(diff.match(a, b)).to.be(false);
	});

});