'use strict';

/**
Magicka Wizard Wars spell parser function.
Recieves a string.
Outputs a Array of spellMatch objects.
spellMatch = {
	start, // position in the original string where spell begins
	end,   // position in the original string where spell ends
	spell, // string containing the spell (modifiers included)
}
**/

function isVerySpecialCase(spell, str) {
	if (str.substring(spell.start-4, spell.end).match(/M\s*\:\s*WW/) != null)
		return true;
	else if (str.substring(spell.start-10, spell.end).match(/Magicka\s*\:\s*WW/) != null)
		return true;
	return false;
}

function spellParser(str) {
	var filter = ['FAQ'];
	var result = [];
	var re = /((!|c)?([QWERASDFX]{2,3}|[QWERASDFX]\[[QWERASDFX][QWERASDFX]\]|\[[QWERASDFX][QWERASDFX]\][QWERASDFX]|\[[QWERASDFX]{2,3}\])|(!|c)[QWERASDFX]|\[[QWERASDFX]\])(:[0-9]{1,3})?/g;
	var match = re.exec(str);
	while (match != null) {
		var s = {
			start : match.index,
			end   : re.lastIndex,
			spell : str.substring(match.index, re.lastIndex)
		};
		if (filter.indexOf(s.spell) < 0 && 
			(s.start == 0 || str[s.start-1].match(/[\W\s]/) != null) &&
			(s.end == str.length || str[s.end].match(/[\W\s]/) != null) &&
			!isVerySpecialCase(s, str))
			result.push(s);
		else
			console.log(str.substring(s.start-1, s.end +1));
		match = re.exec(str);
	}
	return result;
}
