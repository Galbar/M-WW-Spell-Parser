var knownSites = [
[/http:\u002F\u002Fforum.paradoxplaza.com\u002Fforum\u002F/g,"class","messageContent"],
[/https:\u002F\u002Fforum.paradoxplaza.com\u002Fforum\u002F/g,"class","messageContent"],
[/http:\u002F\u002Fsteamcommunity.com\u002Fsharedfiles/g,"id","profileBlock"],
[/https:\u002F\u002Fsteamcommunity.com\u002Fsharedfiles/g,"id","profileBlock"]
];

var knownSpecialSites = [
[/http:\u002F\u002Fsteamcommunity.com\u002Fchat/g, "steamChat.js"]
];

if (chrome.storage.local.get('active', function(){}) == undefined) {
  chrome.storage.local.set({'active': true});
}

chrome.browserAction.onClicked.addListener(function() {
	chrome.storage.local.get('active', function(ss) {
		ss.active = !ss.active;
		chrome.storage.local.set({'active': ss.active});
		if (ss.active) {
			chrome.browserAction.setIcon({path: "icon.png"});
		}
		else {
			chrome.browserAction.setIcon({path: "icon-disabled.png"});
		}
	});
	chrome.tabs.reload();
});

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	chrome.storage.local.get('active', function(ss) {
		if (ss.active) {
			for (var i = 0; i < knownSites.length; i++) {
				if (tab.url.match(knownSites[i][0])) {
					chrome.tabs.executeScript(tabId, {
						file: "lib/spellParser.js"
					});
					chrome.tabs.executeScript(tabId, {
						file: "lib/explorer.js"
					});
					chrome.tabs.executeScript(tabId, {
						file: "lib/MWWSpellParser.js"
					});
					chrome.tabs.insertCSS(tabId, {
						file: "style/style.css"
					});
					chrome.tabs.executeScript(tabId, {
						code: 'MWWSpellParser("'+knownSites[i][1]+'", "'+knownSites[i][2]+'");'
					});
				}
			};

			for (var i = 0; i < knownSpecialSites.length; i++) {
				if (tab.url.match(knownSpecialSites[i][0])) {
					chrome.tabs.executeScript(tabId, {
						file: "lib/spellParser.js"
					});
					chrome.tabs.executeScript(tabId, {
						file: "lib/explorer.js"
					});
					chrome.tabs.executeScript(tabId, {
						file: "lib/MWWSpellParser.js"
					});
					chrome.tabs.insertCSS(tabId, {
						file: "style/style.css"
					});
					chrome.tabs.executeScript(tabId, {
						file: knownSpecialSites[i][1]
					});
				}
			};
		}
	});
});