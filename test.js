"use strict";
const expect = require("chai").expect;
const isURL = require("./");
const parseURL = require("url").parse;
const incompleteURL = require("whatwg-url").URL;

// TODO :: use destructuring when dropping support for Node 4.x
const _require = require("universal-url"),
      URL = _require.URL,
      URLSearchParams = _require.URLSearchParams;

const it_searchParamsOnly = URLSearchParams===undefined ? it.skip : it;



it_searchParamsOnly("accepts a full implemention", function()
{
	expect( isURL(new URL("http://domain/")) ).to.be.true;
	expect( isURL(new URL("http://domain/"),false) ).to.be.true;
});



it("can accept a partial implemention", function()
{
	expect( isURL.lenient(new incompleteURL("http://domain/")) ).to.be.true;
});



it("rejects non-URLs", function()
{
	expect( isURL("http://domain/") ).to.be.false;
	expect( isURL(parseURL("http://domain/")) ).to.be.false;
	expect( isURL(Symbol("http://domain/")) ).to.be.false;
	expect( isURL({}) ).to.be.false;
	expect( isURL([]) ).to.be.false;
	expect( isURL(/regex/) ).to.be.false;
	expect( isURL(true) ).to.be.false;
	expect( isURL(1) ).to.be.false;
	expect( isURL(null) ).to.be.false;
	expect( isURL(undefined) ).to.be.false;
	expect( isURL() ).to.be.false;
});



it("rejects a mocked partial implementation using toStringTag", function()
{
	const mock = { href:"http://domain/" };

	mock[Symbol.toStringTag] = "URL";

	expect( isURL(mock) ).to.be.false;
});



describe("Weaknesses", function()
{
	it_searchParamsOnly("accepts a mocked full implementation", function()
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



	it("can accept a mocked partial implementation", function()
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
