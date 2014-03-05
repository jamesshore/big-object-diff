// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var expect = require("expect.js");
var diff = require("./index.js");

describe("renders differences for", function() {
	it("matching values", function() {
		expect(diff.renderDiff(1, 1)).to.equal("");
		expect(diff.renderDiff(null, null)).to.equal("");
	});

	it("flat types", function() {
		expect(diff.renderDiff("a", "b")).to.equal('"b"   // expected "a"');
		expect(diff.renderDiff(null, "b")).to.equal('"b"   // expected null');
		expect(diff.renderDiff("a", null)).to.equal('null   // expected "a"');
	});

	it("functions", function() {
		var anon1 = function() {};
		var anon2 = function() {};
		var b = function b() {};

		expect(diff.renderDiff(anon1, b)).to.equal("b()   // expected <anon>()");
		expect(diff.renderDiff(anon1, anon2)).to.equal("<anon>()   // expected different <anon>()");
	});

	describe("objects:", function() {
		it("compared to flat types", function() {
			expect(diff.renderDiff(99, {})).to.equal("{}   // expected 99");
			expect(diff.renderDiff({}, 99)).to.equal("99   // expected {}");

			expect(diff.renderDiff(99, { a: 1 })).to.equal(
				"// expected 99 but got:\n" +
				"  {\n" +
				"    a: 1\n" +
				"  }"
			);

			expect(diff.renderDiff({ a: 1 }, 99)).to.equal(
				"99   // expected:\n" +
				"  {\n" +
				"    a: 1\n" +
				"  }"
			);
		});

		it("different values", function() {
			expect(diff.renderDiff({ a: 1, b: 2, c: 3 }, { a: 100, b: 200, c: 300 })).to.equal(
				"{\n" +
				"  a: 100   // expected 1\n" +
				"  b: 200   // expected 2\n" +
				"  c: 300   // expected 3\n" +
				"}"
			);
		});

		it("elides identical properties", function() {
			expect(diff.renderDiff({ a: 1, b: 2, c: 3 }, { a: 1, b: "X", c: 3 })).to.equal(
				"{\n" +
				'  b: "X"   // expected 2\n' +
				"}"
			);
		});

		it("extra properties", function() {
			expect(diff.renderDiff({ a: 1, b: 2 }, { a: 1, b: 2, c: 3, d: 4 })).to.equal(
				"{\n" +
				"  // extra properties:\n" +
				"  c: 3\n" +
				"  d: 4\n" +
				"}"
			);
		});

		it("missing properties", function() {
			expect(diff.renderDiff({ a: 1, b: 2, c: 3 }, { a: 1 })).to.equal(
				"{\n" +
				"  // missing properties:\n" +
				"  b: 2\n" +
				"  c: 3\n" +
				"}"
			);
		});

		it("different prototype");  // TODO
	});

	describe("arrays:", function() {
		it("compared to flat types", function() {
			expect(diff.renderDiff(99, [])).to.equal("[]   // expected 99");
			expect(diff.renderDiff([], 99)).to.equal("99   // expected []");

			expect(diff.renderDiff(99, [ 1 ])).to.equal(
				"// expected 99 but got:\n" +
				"  [\n" +
				"    0: 1\n" +
				"  ]"
			);

			expect(diff.renderDiff([ 1 ], 99)).to.equal(
				"99   // expected:\n" +
				"  [\n" +
				"    0: 1\n" +
				"  ]"
			);
		});

		it("different values", function() {
			expect(diff.renderDiff([ 1, 2, 3 ], [ 100, 200, 300 ])).to.equal(
				"[\n" +
				"  0: 100   // expected 1\n" +
				"  1: 200   // expected 2\n" +
				"  2: 300   // expected 3\n" +
				"]"
			);
		});

		it("elides identical properties", function() {
			expect(diff.renderDiff([ 1, 2, 3 ], [1, "X", 3 ])).to.equal(
				"[\n" +
				'  1: "X"   // expected 2\n' +
				"]"
			);
		});

		it("extra properties", function() {
			expect(diff.renderDiff([ 1, 2 ], [ 1, 2, 3, 4 ])).to.equal(
				"[\n" +
				"  // extra properties:\n" +
				"  2: 3\n" +
				"  3: 4\n" +
				"]"
			);
		});

		it("missing properties", function() {
			expect(diff.renderDiff([ 1, 2, 3 ], [ 1 ])).to.equal(
				"[\n" +
				"  // missing properties:\n" +
				"  1: 2\n" +
				"  2: 3\n" +
				"]"
			);
		});

		it("nested objects", function() {
			expect(diff.renderDiff({ a: { b: 1 }}, { a: { b: 99 }})).to.equal(
				"{\n" +
				"  a: {\n" +
				"    b: 99   // expected 1\n" +
				"  }\n" +
				"}"
			);
		});

		it("nested and mixed", function() {
			expect(diff.renderDiff([ 1, { a: [ 2, 3 ] }], [ 1, { a: [ 2, 99 ] }])).to.equal(
				"[\n" +
				"  1: {\n" +
				"    a: [\n" +
				"      1: 99   // expected 3\n" +
				"    ]\n" +
				"  }\n" +
				"]"
			);
		});
	});

	describe("arrays and objects compared:", function() {

		it("both empty", function() {
			expect(diff.renderDiff([], {})).to.equal("{}   // expected []");
			expect(diff.renderDiff({}, [])).to.equal("[]   // expected {}");
		});

		it("one empty", function() {
			expect(diff.renderDiff([], { a: 1 })).to.equal(
				"// expected [] but got:\n" +
				"  {\n" +
				"    a: 1\n" +
				"  }"
			);

			expect(diff.renderDiff({ a: 1 }, [])).to.equal(
				"[]   // expected:\n" +
				"  {\n" +
				"    a: 1\n" +
				"  }"
			);

			expect(diff.renderDiff({}, [ 1 ])).to.equal(
				"// expected {} but got:\n" +
				"  [\n" +
				"    0: 1\n" +
				"  ]"
			);

			expect(diff.renderDiff([ 1 ], {})).to.equal(
				"{}   // expected:\n" +
				"  [\n" +
				"    0: 1\n" +
				"  ]"
			);
		});

		it("neither empty", function() {
			expect(diff.renderDiff({ a: 1 }, [ 2 ])).to.equal(
				"// expected object:\n" +
				"  {\n" +
				"    a: 1\n" +
				"  }\n" +
				"// but got array:\n" +
				"  [\n" +
				"    0: 2\n" +
				"  ]"
			);

			expect(diff.renderDiff([ 1 ], { a: 2 })).to.equal(
				"// expected array:\n" +
				"  [\n" +
				"    0: 1\n" +
				"  ]\n" +
				"// but got object:\n" +
				"  {\n" +
				"    a: 2\n" +
				"  }"
			);
		});
	});
});

describe("renders", function() {

	describe("flat types:", function() {
		it("undefined", function() {
			expect(diff.render(undefined)).to.equal("undefined");
		});

		it("null", function() {
			expect(diff.render(null)).to.equal("null");
		});

		it("boolean", function() {
			expect(diff.render(true)).to.equal("true");
			expect(diff.render(false)).to.equal("false");
		});

		it("string", function() {
			expect(diff.render("")).to.equal('""');
			expect(diff.render("foo")).to.equal('"foo"');
			expect(diff.render("\t\tfoo\n\n")).to.equal('"\\t\\tfoo\\n\\n"');
		});

		it("number", function() {
			expect(diff.render(0)).to.equal("0");
			expect(diff.render(1.23)).to.equal("1.23");
			expect(diff.render(NaN)).to.equal("NaN");
		});

		it("function", function() {
			function namedFn() {}
			var anonFn = function() {};

			expect(diff.render(namedFn)).to.equal("namedFn()");
			expect(diff.render(anonFn)).to.equal("<anon>()");
		});
	});

	describe("objects:", function() {
		it("empty", function() {
			expect(diff.render({})).to.equal("{}");
		});

		it("flat", function() {
			expect(diff.render({ a: 1, b: 2, c: 3 })).to.equal(
				"{\n" +
				"  a: 1\n" +
				"  b: 2\n" +
				"  c: 3\n" +
				"}"
			);
		});

		it("with 'length' property", function() {
			expect(diff.render({ length: 3 })).to.equal("{\n  length: 3\n}");
		});

		it("nested", function() {
			expect(diff.render({ a: 1, b: { b1: 2, b2: 3 } })).to.equal(
				"{\n" +
				"  a: 1\n" +
				"  b: {\n" +
				"    b1: 2\n" +
				"    b2: 3\n" +
				"  }\n" +
				"}"
			);
		});
	});

	describe("arrays:", function() {
		it("empty", function() {
			expect(diff.render([])).to.equal("[]");
		});

		it("flat", function() {
			expect(diff.render([1, 2, 3])).to.equal(
				"[\n" +
				"  0: 1\n" +
				"  1: 2\n" +
				"  2: 3\n" +
				"]"
			);
		});

		it("sparse", function() {
			var a = [];
			a[3000] = 1;

			expect(diff.render(a)).to.equal(
				"[\n" +
				"  3000: 1\n" +
				"]"
			);
		});

		it("nested and mixed", function() {
			expect(diff.render([ 1, { a: [ 2, 3 ] }])).to.equal(
				"[\n" +
				"  0: 1\n" +
				"  1: {\n" +
				"    a: [\n" +
				"      0: 2\n" +
				"      1: 3\n" +
				"    ]\n" +
				"  }\n" +
				"]"
			);
		});
	});
});

describe("matches", function() {

	describe("flat types:", function() {
		it("undefined", function() {
			expect(diff.match(undefined, undefined)).to.be(true);
			expect(diff.match(undefined, null)).to.be(false);
		});

		it("null", function() {
			expect(diff.match(null, null)).to.be(true);
			expect(diff.match(null, undefined)).to.be(false);
			expect(diff.match(null, {})).to.be(false);
			expect(diff.match({}, null)).to.be(false);
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

	describe("objects:", function() {
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

	describe("arrays:", function() {
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
});
