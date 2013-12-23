var parser = new MWWSpellParser('', '');

function hasClass(element, cls)
{
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function addClass(element, cls)
{
    element.className += ' ' + cls;
}

function ParseNewMessages()
{
	var chat_messages = document.getElementsByClassName('chat_message_text');
	for (var i = 0; i < chat_messages.length; i++) {
		if (!hasClass(chat_messages[i], 'MWWSP-parsed'))
		{
			chat_messages[i].innerHTML = parser.ParseString(chat_messages[i].innerHTML);
			addClass(chat_messages[i], 'MWWSP-parsed');
		};
	};
}

setInterval(function(){ParseNewMessages()}, 500);