"use strict";
const hasToStringTag = require("has-to-string-tag-x");
const isObject = require("is-object");

const toString = Object.prototype.toString;
const urlClass = "[object URL]";

const hash = "hash";
const host = "host";
const hostname = "hostname";
const href = "href";
const password = "password";
const pathname = "pathname";
const port = "port";
const protocol = "protocol";
const search = "search";
const username = "username";



const isURL = (url, supportIncomplete=false) =>
{
	if (!isObject(url))
	{
		return false;
	}
	else if (!hasToStringTag && toString.call(url) === urlClass)
	{
		// Native implementation in older browsers -- unlikely, but thorough
		return supportIncomplete;
	}
	else if
		(!(
			href     in url &&
			protocol in url &&
			username in url &&
			password in url &&
			hostname in url &&
			port     in url &&
			host     in url &&
			pathname in url &&
			search   in url &&
			hash     in url
		))
	{
		return false;
	}
	else if (!supportIncomplete)
	{
		// TODO :: write a separate isURLSearchParams ?
		return isObject(url.searchParams);
	}
	else
	{
		return true;
	}
};



isURL.lenient = url => isURL(url, true);



module.exports = isURL;
