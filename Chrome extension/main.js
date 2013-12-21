var knownSites = [
[/http:\u002F\u002Fforum.paradoxplaza.com\u002Fforum\u002F/g,"class","postbody"],
[/https:\u002F\u002Fforum.paradoxplaza.com\u002Fforum\u002F/g,"class","postbody"],
[/http:\u002F\u002Fsteamcommunity.com\u002Fsharedfiles/g,"id","profileBlock"],
[/https:\u002F\u002Fsteamcommunity.com\u002Fsharedfiles/g,"id","profileBlock"]
];

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab)
{
	for (var i = 0; i < knownSites.length; i++)
	{
		if (tab.url.match(knownSites[i][0]))
		{
			chrome.tabs.executeScript(tabId,
			{
				file: "MWW-parser-1.10.js"
			});
			chrome.tabs.insertCSS(tabId,
			{
				file: "style.css"
			});
			chrome.tabs.executeScript(tabId,
			{
				code: 'if(p==undefined) var p = new MWWSpellParser("'+knownSites[i][1]+'", "'+knownSites[i][2]+'");'
			});
		}
	};
});