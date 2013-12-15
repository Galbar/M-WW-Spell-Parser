var elements = ["Q", "W", "E", "R", "A", "S", "D", "F", "X"];
var modifiers = ["[", "]", "!", "c"];
var separators = [" ", "<", ">", "+", ",", "\"", ":", "(", ")", "\n", "."];

function isElement (c) {
	for (var i = 0; i < elements.length; i++) {
		if (elements[i] == c)
			return i;
	};
	return -1;
}

function isModifier (c) {
	for (var i = 0; i < modifiers.length; i++) {
		if (modifiers[i] == c)
		{
			return i;
		}
	};
	return -1;
}

function isSeparator (c) {
	for (var i = 0; i < separators.length; i++) {
		if (separators[i] == c)
			return i;
	};
	return -1;
}

function ParseSpells(text)
{
	var elem_count = 0;
	var not_in_possible_spell = true;
	var mod_open = false;
	var out = "";
	var spell_html = "";
	var cancel_spell = false;
	var ret_text = "";
	var last_pos = 0;

	console.log("Empieza la acción");
	for (var it = 0; it < text.length || !not_in_possible_spell; it++)
	{
		//console.log(text[it]);
		if ((isSeparator(text[it]) >= 0 && !not_in_possible_spell) || it >= text.length || cancel_spell || (elem_count > 3 && !mod_open))
		{
			if (cancel_spell)
			{
				it--;
				console.log("cancelling spell "+out);
				for (; it < text.length && !(isSeparator(text[it]) >= 0); it++);

			console.log(text.substring(it-1,it+2));
				cancel_spell = false;
			}
			else if (!mod_open && elem_count > 0 && elem_count < 4)
			{
				console.log("Hechizo acabado: "+out);
				console.log(text.substring(it-out.length,it));
				ret_text += text.substring(last_pos,it-out.length)+spell_html;
				last_pos = it;
			}
			else
			{
				console.log("Resultó que no es un hechizo");
			}
			console.log("-----------------");
			not_in_possible_spell = true;
			out = "";
			spell_html = "";
			mod_open = false;
			elem_count = 0;
			continue;
		};

		var elem_or_mod = -1;
		if ((elem_or_mod = isModifier (text[it])) >= 0)
		{
			if (not_in_possible_spell)
			{
				if (elem_or_mod == 0)
				{
					mod_open = true;
					not_in_possible_spell = false;
				}
				else if (elem_or_mod == 2 || elem_or_mod == 3)
				{
					not_in_possible_spell = false;
				}
				else
				{
					console.log("Cancel spell due to"+" wrong mod at begining");
					cancel_spell = true;
					continue;
				}
			}
			else
			{
				if (elem_or_mod == 0 && !mod_open)
				{
					mod_open = true;
					not_in_possible_spell = false;
				}
				else if (elem_or_mod == 0 && mod_open)
				{
					console.log("Cancel spell due to"+" [ already open");
					cancel_spell = true;
					continue;
				}
				else if (elem_or_mod == 1 && !mod_open)
				{
					console.log("Cancel spell due to"+" no [ to close");
					cancel_spell = true;
					continue;
				}
				else if (elem_or_mod == 1 && mod_open)
				{
					mod_open = false;
					not_in_possible_spell = false;
				}
				else if ((elem_or_mod == 2 || elem_or_mod == 3) && elem_count == 0)
				{
					not_in_possible_spell = false;
				}
				else if ((elem_or_mod == 2 || elem_or_mod == 3) && elem_count > 0)
				{
					console.log("Cancel spell due to"+" ! or c not in the begining");
					cancel_spell = true;
					continue;
				}
			}

			if (!not_in_possible_spell)
			{
				console.log("Añado "+modifiers[elem_or_mod]+" a out");
				console.log("mod_open = "+mod_open);
				spell_html += modifiers[elem_or_mod];
				out += modifiers[elem_or_mod];
				continue;
			}
		}

		if ((elem_or_mod = isElement(text[it])) >= 0)
		{
			if (not_in_possible_spell)
			{
				not_in_possible_spell = false;
			}

			elem_count++;

			if (!not_in_possible_spell)
			{
				console.log("Añado "+elements[elem_or_mod]+" a out");
				spell_html += "<i class='MWWElement-"+elements[elem_or_mod]+"'></i>";
				out += elements[elem_or_mod];
			}
			continue;
		}
		console.log("cancelling because char "+text[it]+" is not an element nor modifier");
		cancel_spell = true;
	}
	console.log("Acción acabada");
	ret_text += text.substring(last_pos, text.length);
	return ret_text;
}

var body = document.getElementsByTagName("body")[0];
body.innerHTML = ParseSpells(body.innerHTML);

//console.log(ParseSpells("Lightning - 19<br>AAA<br>AAW, AAR, AAS, AAF<br>AWW, ARR, ASS, AFF<br>ASF, ASR, AWF, AWR<br>AA<br>"));