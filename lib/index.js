"use strict";
const hasToStringTag = require("has-to-string-tag-x");
const isURLSearchParams = require("is-urlsearchparams");
const {lenientProperties, strictProperties} = require("./props");

const searchParams = "searchParams";
const toStringTag = Object.prototype.toString;
const urlClass = "[object URL]";



const isURL = (url, supportIncomplete=false) =>
{
	if (typeof url !== 'object' || url === null)
	{
		return false;
	}
	else if (hasToStringTag && toStringTag.call(url)!==urlClass)
	{
		// Shimmed implementation with incorrect constructor name
		return false;
	}
	else if (!strictProperties.every(prop => prop in url))
	{
		return false;
	}
	else if (supportIncomplete && searchParams in url)
	{
		return isURLSearchParams.lenient(url.searchParams);
	}
	else if (supportIncomplete)
	{
		return true;
	}
	else if (lenientProperties.every(prop => prop in url))
	{
		return isURLSearchParams(url.searchParams);
	}
	else
	{
		return false;
	}
};



isURL.lenient = url => isURL(url, true);



module.exports = isURL;
