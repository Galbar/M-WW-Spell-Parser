var tabs = require("sdk/tabs");
var self = require("sdk/self");
var pageMod = require("sdk/page-mod");
var widgets = require("sdk/widget");
var ss = require("sdk/simple-storage")

var knownSites = [
["http://forum.paradoxplaza.com/forum/showthread.php*","class","postbody"],
["https://forum.paradoxplaza.com/forum/showthread.php*","class","postbody"],
["http://steamcommunity.com/sharedfiles/filedetails/?id=196132827*","id","profileBlock"],
["https://steamcommunity.com/sharedfiles/filedetails/?id=196132827*","id","profileBlock"]
];
var pageMods = [];

if (ss.storage.active == undefined)
{
    ss.storage.active = true;
}

if (ss.storage.active)
{
    ss.storage.icon = self.data.url("icon.jpg");
    for (var i = 0; i < knownSites.length; i++)
    {
        pageMods.push(pageMod.PageMod({
          include: knownSites[i][0],
          contentScriptFile: self.data.url("MWW-parser-1.10.js"),
          contentStyleFile: self.data.url("style.css"),
          contentScript: 'new MWWSpellParser("'+knownSites[i][1]+'", "'+knownSites[i][2]+'");',
        }));
    }
}
else
{
    ss.storage.icon = self.data.url("icon-disabled.jpg");
}

var widget = widgets.Widget({
  id: "MWW-btn",
  label: "M:WW Spell Parser",
  contentURL: ss.storage.icon,
  onClick: function() {
    ss.storage.active = !ss.storage.active;
    if (ss.storage.active)
    {
        this.contentURL = self.data.url("icon.jpg");
        for (var i = 0; i < knownSites.length; i++)
        {
            pageMods.push(pageMod.PageMod({
              include: knownSites[i][0],
              contentScriptFile: self.data.url("MWW-parser-1.10.js"),
              contentStyleFile: self.data.url("style.css"),
              contentScript: 'new MWWSpellParser("'+knownSites[i][1]+'", "'+knownSites[i][2]+'");',
            }));
        }
    }
    else
    {
        this.contentURL = self.data.url("icon-disabled.jpg");
        for (var i = 0; i < pageMods.length; i++)
        {
            pageMods[i].destroy();
        }
    }
    tabs.activeTab.attach({
      contentScript:
        'location.reload();'
    })
  }
});