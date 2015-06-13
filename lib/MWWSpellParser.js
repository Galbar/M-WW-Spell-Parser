'use strict';

function makeSpell (spell) {
	var mwwSpell = document.createElement('strong');
	mwwSpell.className = 'MWWSpell';
	for (var i = 0; i < spell.length; i++) {
		var c = spell[i];
		var spellElem = document.createElement('span');
		if (!isNaN(parseInt(c, 10)) || c == ':') {
			spellElem.className = 'MWWSpellNumber';
			var t = document.createTextNode(c);
			spellElem.appendChild(t);
			mwwSpell.appendChild(spellElem);
			continue;
		}
		if (c == '!')
			spellElem.className = 'MWWModifier-self';
		else if (c == 'c')
			spellElem.className = 'MWWModifier-charged';
		else if (c == '[')
			spellElem.className = 'MWWModifier-open';
		else if (c == ']')
			spellElem.className = 'MWWModifier-close';
		else
			spellElem.className = 'MWWElement-' + c;

		var ti = document.createElement('span');
		var t = document.createTextNode(c);
		ti.className = 'MWWSpellText';
		ti.appendChild(t);
		spellElem.appendChild(ti);
		mwwSpell.appendChild(spellElem);
	};
	return mwwSpell;
}

function MWWSpellParser (name, value) {
	var explorer = new Explorer(
	function(e) {
		return ((e.nodeName == "#text" && !e.mwwspellparser)
			    || e.nodeName == "SCRIPT");
	},
	function(e) {
		if (e.nodeName == "SCRIPT")
			return;
		var str = e.textContent;
		var spells = spellParser(str);
		var prev = 0;
		for (var i = 0; i < spells.length; i++) {
			var r = spells[i];
			var prev_substr = str.substring(prev, r.start);
			var textNode = document.createTextNode(prev_substr);
			textNode.mwwspellparser = true;
			e.parentNode.insertBefore(textNode, e);
			var spellNode = makeSpell(r.spell);
			spellNode.mwwspellparser = true;
			e.parentNode.insertBefore(spellNode, e);
			prev = r.end;
		};
		e.textContent = e.textContent.substring(prev, e.textContent.length);
	});

	var HTMLelements;
	var is_id = false
	if (name == "tag")
	{
		HTMLelements = document.getElementsByTagName(value);
	}
	else if (name == "id")
	{
		is_id = true;
		HTMLelements = document.getElementById(value);
	}
	else if (name == "class")
	{
		HTMLelements = document.getElementsByClassName(value);
	}
	if (HTMLelements != undefined)
	{
		if (is_id)
		{
			explorer.explore(HTMLelements);
		}
		else
		{
			for (var i = 0; i < HTMLelements.length; i++)
			{
				explorer.explore(HTMLelements[i]);
			};
		}
	}
	else
	{
		console.log("No elements found");
	}
}