// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

exports.match = function(a, b) {
	if (typeof a === "number" && isNaN(a)) return isNaN(b);

	return a === b;
};