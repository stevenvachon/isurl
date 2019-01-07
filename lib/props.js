"use strict";

const lenientProperties =
[
	"origin",
	"searchParams",
	"toJSON"
];

const strictProperties =
[
	"hash",
	"host",
	"hostname",
	"href",
	"password",
	"pathname",
	"port",
	"protocol",
	"search",
	// "toString" excluded because Object::toString exists
	"username"
];



module.exports = { lenientProperties, strictProperties };
