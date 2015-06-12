function hasClass(element, cls)
{
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
};

function addClass(element, cls)
{
    element.className += ' ' + cls;
};

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

function ParseNewMessages()
{
	console.log("parsing");
	var chat_messages = document.getElementsByClassName('chat_message_text');
	for (var i = 0; i < chat_messages.length; i++) {
		if (!hasClass(chat_messages[i], 'MWWSP-parsed'))
		{
			explorer.explore(chat_messages[i]);
			addClass(chat_messages[i], 'MWWSP-parsed');
		};
	};
};

console.log("ready!");

setInterval(function(){ParseNewMessages();}, 500);