"use strict";
const customizeURL = require("incomplete-url");
const {describe, it} = require("mocha");
const {expect} = require("chai");
const isURL = require("./");
const {parse: parseURL} = require("url");
const {URL, URLSearchParams} = require("universal-url");



it("rejects non-URLs", () =>
{
	const fixtures =
	[
		"http://domain/",
		parseURL("http://domain/"),
		Symbol("http://domain/"),
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



it("rejects a mocked partial implementation using toStringTag", () =>
{
	const mock = { href:"http://domain/" };

	mock[Symbol.toStringTag] = "URL";

	expect( isURL(mock) ).to.be.false;
	expect( isURL.lenient(mock) ).to.be.false;
});



it("accepts a full implemention", () =>
{
	expect( isURL(new URL("http://domain/")) ).to.be.true;
	expect( isURL.lenient(new URL("http://domain/")) ).to.be.true;
});



it("can accept a partial implemention", () =>
{
	const {IncompleteURL} = customizeURL({ noSearchParams:true });

	expect( isURL(new IncompleteURL("http://domain/")) ).to.be.false;
	expect( isURL.lenient(new IncompleteURL("http://domain/")) ).to.be.true;
});



describe("Weaknesses", () =>
{
	it("accepts a mocked full implementation", () =>
	{
		const mock =
		{
			href: "http://domain/",
			protocol: "http:",
			username: "",
			password: "",
			hostname: "domain",
			port: "",
			host: "domain",
			pathname: "/",
			search: "",
			searchParams: {},
			hash: ""
		};

		mock[Symbol.toStringTag] = "URL";

		expect( isURL(mock) ).to.be.true;
	});



	it("can accept a mocked partial implementation", () =>
	{
		const mock =
		{
			href: "http://domain/",
			protocol: "http:",
			username: "",
			password: "",
			hostname: "domain",
			port: "",
			host: "domain",
			pathname: "/",
			search: "",
			hash: ""
		};

		mock[Symbol.toStringTag] = "URL";

		expect( isURL.lenient(mock) ).to.be.true;
	});
});
