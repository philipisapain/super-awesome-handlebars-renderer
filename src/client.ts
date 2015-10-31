/// <reference path="../typings/all.d.ts" />

import $ = require("jquery");
import Handlebars = require("handlebars");

var templateInput:JQuery = $("#template");
var jsonInput:JQuery = $("#json");
var renderButton:JQuery = $("#render");
var parseErrorsList:JQuery = $("#parse-errors-list");
var preview:JQuery = $("#preview");

registerHelpers();
loadValuesFromStorage();

renderButton.on("click", doRender);

doRender();

function loadValuesFromStorage()
{
	var templateString:string = sessionStorage.getItem("template");
	if(!templateString || !templateString.length)
	{
		templateString = "<p>Hello {{who}}</p>";
	}

	var jsonString:string = sessionStorage.getItem("json");
	if(!jsonString || !jsonString.length)
	{
		jsonString = JSON.stringify({who:"world"});
	}

	templateInput.val(templateString);
	jsonInput.val(jsonString);
}

$(window).unload(() =>
{
	sessionStorage.setItem("template", templateInput.val());
	sessionStorage.setItem("json", jsonInput.val());
});

function registerHelpers()
{
	Handlebars.registerHelper("safehtml", (context:any, options:any) =>
	{
		return "SAFEHTML";
	});

	Handlebars.registerHelper("helperMissing", (context:any, options:any) =>
	{
		appendParseError(`{{${context.name}}} has no value specified.`);
		return `{{${context.name}}}`;
	});
}

function doRender()
{
	parseErrorsList.empty();
	try
	{
		var template:string = templateInput.val();
		var jsonString:string = jsonInput.val();
		var jsonObject:any = JSON.parse(jsonString);

		var handlebarsTemplate:HandlebarsTemplateDelegate = Handlebars.compile(template);
		var html:string = handlebarsTemplate(jsonObject);
		preview.attr("srcdoc", html);
	}
	catch(error)
	{
		console.error(`Error rendering template: ${error}`);
	}
	if(!parseErrorsList.children().length)
	{
		parseErrorsList.hide();
	}
	else {
		parseErrorsList.show();
	}
}

function appendParseError(error:string)
{
	var parseErrorElement = $(`<li class='parse-error'>${error}</li>`);
	parseErrorsList.append(parseErrorElement);
}


