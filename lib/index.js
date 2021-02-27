"use strict";
const {default:hasToStringTag} = require("has-to-string-tag-x");
const isObject = require("is-object");
const isURLSearchParams = require("is-urlsearchparams");
const {LENIENT_PROPERTIES, STRICT_PROPERTIES} = require("./props");

const SEARCH_PARAMS = "searchParams";
const URL_CLASS = "[object URL]";

const toStringTag = Object.prototype.toString;



const isURL = (url, supportIncomplete=false) =>
{
	if (!isObject(url))
	{
		return false;
	}
	else if (hasToStringTag && toStringTag.call(url)!==URL_CLASS)
	{
		// Shimmed implementation with incorrect constructor name
		return false;
	}
	else if (!STRICT_PROPERTIES.every(prop => prop in url))
	{
		return false;
	}
	else if (supportIncomplete && SEARCH_PARAMS in url)
	{
		return isURLSearchParams.lenient(url.searchParams);
	}
	else if (supportIncomplete)
	{
		return true;
	}
	else if (LENIENT_PROPERTIES.every(prop => prop in url))
	{
		return isURLSearchParams(url.searchParams);
	}
	else
	{
		return false;
	}
};



isURL.lenient = url => isURL(url, true);



module.exports = Object.freeze(isURL);
