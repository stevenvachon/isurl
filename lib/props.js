"use strict";

const LENIENT_PROPERTIES =
[
	"origin",
	"searchParams",
	"toJSON"
];

const STRICT_PROPERTIES =
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



module.exports = { LENIENT_PROPERTIES, STRICT_PROPERTIES };
