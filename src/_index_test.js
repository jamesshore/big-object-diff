// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var expect = require("expect.js");
var diff = require("./index.js");

describe("flat types:", function() {

	it("undefined", function() {
		expect(diff.match(undefined, undefined)).to.be(true);
		expect(diff.match(undefined, null)).to.be(false);
	});

	it("null", function() {
		expect(diff.match(null, null)).to.be(true);
		expect(diff.match(null, undefined)).to.be(false);
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