"use strict";
const expect = require("chai").expect;
const isURL = require("./");
const parseURL = require("url").parse;
const semver = require("semver");

const atLeastNode6 = semver.satisfies(process.version, ">= 6");

const it_atLeastNode6 = atLeastNode6 ? it : it.skip;

let URL,URLSearchParams;

if (atLeastNode6)
{
	const uurl = require("universal-url");
	URL = uurl.URL,
    URLSearchParams = uurl.URLSearchParams;
}



it_atLeastNode6("accepts a full implemention", function()
{
	expect( isURL(new URL("http://domain/")) ).to.be.true;
	expect( isURL(new URL("http://domain/"),false) ).to.be.true;
});



it_atLeastNode6("can accept a partial implemention", function()
{
	function IncompleteURL(url, base) {
		this.url = new URL(url, base);

		// Extend all `URL` getters except `searchParams`
		Object.keys(URL.prototype)
		.filter(key => key !== "searchParams")
		.forEach(key => Object.defineProperty
		(
			this, key,
			{
				get: () => this.url[key],
				set: newValue => this.url[key] = newValue
			}
		))
	}

	expect( isURL(new IncompleteURL("http://domain/")) ).to.be.false;
	expect( isURL.lenient(new IncompleteURL("http://domain/")) ).to.be.true;
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
	it("accepts a mocked full implementation", function()
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
