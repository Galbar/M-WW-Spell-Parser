// Magicka: Wizard Wars Spell Parser class
// type can be: "tag", "id", "class"
// name is the tag/id/class of the HTML element/s inside of which the parser will work

function MWWSpellParser(type, name)
{
	this.type = type;
	this.name = name;
	this.skip_HTML = true;
	this.elements = ['Q', 'W', 'E', 'R', 'A', 'S', 'D', 'F', 'X'];
	this.modifiers = ['[', ']', '!', 'c'];
	this.it = 0;
	this.text = "";
	this.non_spells_phrases = [
	"\nA ",
	">A ",
	"\nX ",
	">X ",
	" X ",
	"M:WW",
	":WW",
	"-WW-",
	". A ",
	"FAQ",
	"F.A.Q.",
	":S",
	":D",
    "'S ",
    "'RE ",
    " D:"
	];
	this.ParseSpells();
}

MWWSpellParser.prototype.skipHTML = function()
{
	if (this.text[this.it] == '<')
	{
		if ((this.text[this.it+1] >= 'a' && this.text[this.it+1] <= 'z')
		 || (this.text[this.it+1] >= 'A' && this.text[this.it+1] <= 'Z')
		 || (this.text[this.it+1] >= '0' && this.text[this.it+1] <= '9')
		 || this.text[this.it+1] == '!')
		{
			while (this.it < this.text.length && this.text[this.it] != '>')
			{
				this.it++;
			}
			return true;
		}
	}
	return false;
};

MWWSpellParser.prototype.checkIfPhrase = function()
{
	var found = false;
	for (var i = 0; i < this.non_spells_phrases.length && !found; i++)
	{
		//console.log("Comprobando si frase: ");
		//console.log(this.non_spells_phrases[i]);
		//console.log(this.text.substring(this.it-1,this.it-1+this.non_spells_phrases[i].length));
		if (this.non_spells_phrases[i] == this.text.substring(this.it-1,this.it-1+this.non_spells_phrases[i].length))
		{
			found =  true;
			this.it--;
			for (var j = 0; j < this.non_spells_phrases[i].length; j++)
			{
				this.it++;
			};
		}
	};
	return found;
};

MWWSpellParser.prototype.isElement = function(c)
{
	for (var i = 0; i < this.elements.length; i++)
	{
		if (this.elements[i] == c)
			return i;
	};
	return -1;
};

MWWSpellParser.prototype.isModifier = function(c)
{
	for (var i = 0; i < this.modifiers.length; i++)
	{
		if (this.modifiers[i] == c)
		{
			return i;
		}
	};
	return -1;
};

MWWSpellParser.prototype.isSeparator = function(c)
{
	var ret = true;
	ret = !((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9'));
	for (var i = 0; i < this.elements.length && ret; i++) {
		ret = (this.elements[i] != c);
	};
	for (var i = 0; i < this.modifiers.length && ret; i++) {
		ret = (this.modifiers[i] != c);
	};
	return ret;
};

MWWSpellParser.prototype.ParseString = function(text)
{
	this.text = text;
	this.it = 0;

	var elem_count = 0;
	var not_in_possible_spell = true;
	var mod_open = false;
	var mod_used = false;
	var out = "";
	var spell_html = "";
	var cancel_spell = false;
	var ret_text = "";
	var last_pos = 0;

	//console.log("Empieza la acción");
	for (this.it = 0; this.it < this.text.length || !not_in_possible_spell; this.it++)
	{
		//console.log(this.text[this.it]);
		if (this.checkIfPhrase()) cancel_spell = true;
		if (this.skip_HTML && not_in_possible_spell)
		{
			if(this.skipHTML()) cancel_spell = true;
		}
		if ((this.isSeparator(this.text[this.it]) && !not_in_possible_spell) || this.it >= this.text.length || cancel_spell /*|| (elem_count > 3 && !mod_open)*/)
		{
			if (cancel_spell)
			{
				this.it--;
				//console.log("cancelling spell "+out);
				for (; this.it < this.text.length && !(this.isSeparator(this.text[this.it])); this.it++);
				//console.log(this.text.substring(this.it-1,this.it+2));
				cancel_spell = false;
			}
			else if (!mod_open && elem_count > 0 && elem_count < 4)
			{
				//console.log("Hechizo acabado: "+out);
				//console.log(this.text.substring(this.it-out.length,this.it));
				ret_text += this.text.substring(last_pos,this.it-out.length)+"<strong class='MWWSpell'>"+spell_html+"</strong>";
				last_pos = this.it;
			}
			else
			{
				//console.log("Resultó que no es un hechizo");
			}
			//console.log("-----------------");
			not_in_possible_spell = true;
			out = "";
			spell_html = "";
			mod_open = false;
			elem_count = 0;
			continue;
		};

		var elem_or_mod = -1;
		if ((elem_or_mod = this.isModifier (this.text[this.it])) >= 0)
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
					//console.log("Cancel spell due to"+" wrong mod at begining");
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
					//console.log("Cancel spell due to"+" [ already open");
					cancel_spell = true;
					continue;
				}
				else if (elem_or_mod == 1 && !mod_open)
				{
					//console.log("Cancel spell due to"+" no [ to close");
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
					//console.log("Cancel spell due to"+" ! or c not in the begining");
					cancel_spell = true;
					continue;
				}
			}

			if (!not_in_possible_spell)
			{
				//console.log("Añado "+this.modifiers[elem_or_mod]+" a out");
				//console.log("mod_open = "+mod_open);
				spell_html += this.modifiers[elem_or_mod];
				out += this.modifiers[elem_or_mod];
				continue;
			}
		}

		if ((elem_or_mod = this.isElement(this.text[this.it])) >= 0)
		{
			if (not_in_possible_spell)
			{
				not_in_possible_spell = false;
			}

			elem_count++;

			if (!not_in_possible_spell)
			{
				//console.log("Añado "+this.elements[elem_or_mod]+" a out (elem_count = "+elem_count+")");
				spell_html += "<i class='MWWElement-"+this.elements[elem_or_mod]+"'><i class='MWWElement-text'>"+this.elements[elem_or_mod]+"</i></i>";
				out += this.elements[elem_or_mod];
			}
			continue;
		}
		//console.log("cancelling because char "+this.text[this.it]+" is not an element nor modifier");
		cancel_spell = true;
	}
	//console.log("Acción acabada");
	ret_text += this.text.substring(last_pos, this.text.length);
	return ret_text;
};

MWWSpellParser.prototype.ParseSpells = function()
{
	var HTMLelements;
	var is_id = false
	if (this.type == "tag")
	{
		HTMLelements = document.getElementsByTagName(this.name);
	}
	else if (this.type == "id")
	{
		is_id = true;
		HTMLelements = document.getElementById(this.name);
	}
	else if (this.type == "class")
	{
		HTMLelements = document.getElementsByClassName(this.name);
	}
	if (HTMLelements != undefined)
	{
		if (is_id)
		{
			console.log("is_id");
			HTMLelements.innerHTML = this.ParseString(HTMLelements.innerHTML);
		}
		else
		{
			for (var i = 0; i < HTMLelements.length; i++)
			{
				HTMLelements[i].innerHTML = this.ParseString(HTMLelements[i].innerHTML);
			};
		}
	}
};
