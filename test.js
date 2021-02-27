"use strict";
const {after, before, beforeEach, describe, it} = require("mocha");
const customizeSymbol = require("incomplete-symbol");
const customizeURL = require("incomplete-url");
const decache = require("decache");
const {expect} = require("chai");
const {LENIENT_PROPERTIES, STRICT_PROPERTIES} = require("./lib/props");
const {parse: parseURL, URL: NativeURL} = require("url");
const {URL: ShimmedURL} = require("whatwg-url");

const URL_PROPERTIES = [...LENIENT_PROPERTIES, ...STRICT_PROPERTIES];
const URL_STRING = "http://domain/";
let isURL;



const createMock = (config={}) =>
{
	const mock =
	{
		hash: "",
		host: "domain",
		hostname: "domain",
		href: URL_STRING,
		origin: URL_STRING,
		password: "",
		pathname: "/",
		port: "",
		protocol: "http:",
		search: "",
		searchParams:
		{
			append: () => {},
			delete: () => {},
			entries: () => {},
			get: () => {},
			getAll: () => {},
			has: () => {},
			keys: () => {},
			set: () => {},
			sort: () => {},
			values: () => {}
		},
		toJSON: () => {},
		username: ""
	};

	const {skipKey, toStringTag} = config;

	if (skipKey && URL_PROPERTIES.includes(skipKey))
	{
		delete mock[skipKey];
	}
	else if (skipKey)
	{
		delete mock.searchParams[skipKey];
	}

	if (toStringTag === true)
	{
		mock[Symbol.toStringTag] = "URL";
	}

	if (toStringTag===true && mock.searchParams)
	{
		mock.searchParams[Symbol.toStringTag] = "URLSearchParams";
	}

	return mock;
};



const requireFreshLibs = () =>
{
	decache("has-to-string-tag-x");
	decache("./lib");
	isURL = require("./lib");
};



before(() => requireFreshLibs());



it("accepts a native full implemention", () =>
{
	const url = new NativeURL(URL_STRING);

	expect( isURL(url) ).to.be.true;
	expect( isURL.lenient(url) ).to.be.true;
});



it("accepts a shimmed full implemention", () =>
{
	const url = new ShimmedURL(URL_STRING);

	expect( isURL(url) ).to.be.true;
	expect( isURL.lenient(url) ).to.be.true;
});



it("can accept a partial implemention", () =>
{
	const {IncompleteURL} = customizeURL({ urlExclusions:["searchParams"] });
	const url = new IncompleteURL(URL_STRING);

	expect( isURL(url) ).to.be.false;
	expect( isURL.lenient(url) ).to.be.true;
});



it("can accept a partial URLSearchParams implemention", () =>
{
	const {IncompleteURL} = customizeURL({ paramsExclusions:["sort"] });
	const url = new IncompleteURL(URL_STRING);

	expect( isURL(url) ).to.be.false;
	expect( isURL.lenient(url) ).to.be.true;
});



it("rejects non-URL types", () =>
{
	const fixtures =
	[
		URL_STRING,
		createMock(),
		parseURL(URL_STRING),
		parseURL(URL_STRING, true),
		Symbol(URL_STRING),
		{},
		[],
		/regex/,
		true,
		1,
		null,
		undefined
	];

	fixtures.forEach(fixture =>
	{
		expect( isURL(fixture) ).to.be.false;
		expect( isURL.lenient(fixture) ).to.be.false;
	});
});



URL_PROPERTIES.forEach(key =>
{
	it(`rejects a mocked implementation lacking the "${key}" property`, () =>
	{
		const mock = createMock({ skipKey:key, toStringTag:true });

		expect( isURL(mock) ).to.be.false;

		if (LENIENT_PROPERTIES.includes(key))
		{
			expect( isURL.lenient(mock) ).to.be.true;
		}
		else
		{
			expect( isURL.lenient(mock) ).to.be.false;
		}
	});
});



it(`rejects a mocked implementation lacking the "sort" property`, () =>
{
	const mock = createMock({ skipKey:"sort", toStringTag:true });

	expect( isURL(mock) ).to.be.false;
	expect( isURL.lenient(mock) ).to.be.true;
});



describe("Environments lacking @@toStringTag", () =>
{
	const OriginalSymbol = Symbol;



	beforeEach(() =>
	{
		global.Symbol = customizeSymbol(["toStringTag"]);
		requireFreshLibs();
	});



	after(() =>
	{
		global.Symbol = OriginalSymbol;
		requireFreshLibs();
	});



	it("accepts a mocked full implementation with incorrect constructor name", () =>
	{
		const mock = createMock();

		expect( isURL(mock) ).to.be.true;
		expect( isURL.lenient(mock) ).to.be.true;
	});
});



describe("Weaknesses", () =>
{
	it("accepts a mocked full implementation that uses @@toStringTag", () =>
	{
		const mock = createMock({ toStringTag:true });

		expect( isURL(mock) ).to.be.true;
	});



	it("can leniently accept a mocked partial implementation that uses @@toStringTag", () =>
	{
		const noSearchParams = createMock({ skipKey:"searchParams", toStringTag:true });
		const noSort = createMock({ skipKey:"sort", toStringTag:true });

		expect( isURL.lenient(noSearchParams) ).to.be.true;
		expect( isURL.lenient(noSort) ).to.be.true;
	});
});
