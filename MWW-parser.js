// Magicka: Wizard Wars Spell Parser class
// type can be: "tag", "id", "class"
// name is the tag/id/class of the HTML element/s inside of which the parser will work
function MWWSpellParser(type, name)
{
	this.elements = ['Q', 'W', 'E', 'R', 'A', 'S', 'D', 'F', 'X'];
	this.modifiers = ['[', ']', '!', 'c'];
	this.it = 0;
	this.text = "";
}

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
	for (var i = 0; i < this.this.elements.length && ret; i++) {
		ret = (this.this.elements[i] != c);
	};
	for (var i = 0; i < this.this.modifiers.length && ret; i++) {
		ret = (this.this.modifiers[i] != c);
	};
	return ret;
};

MWWSpellParser.prototype.ParseSpells = function(text)
{
	this.text = this.text;
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

	console.log("Empieza la acción");
	for (var this.it = 0; this.it < this.text.length || !not_in_possible_spell; this.it++)
	{
		//console.log(this.text[this.it]);
		if ((this.isSeparator(this.text[this.it]) && !not_in_possible_spell) || this.it >= this.text.length || cancel_spell || (elem_count > 3 && !mod_open))
		{
			if (cancel_spell)
			{
				this.it--;
				console.log("cancelling spell "+out);
				for (; this.it < this.text.length && !(this.isSeparator(this.text[this.it])); this.it++);
				console.log(this.text.substring(this.it-1,this.it+2));
				cancel_spell = false;
			}
			else if (!mod_open && elem_count > 0 && elem_count < 4)
			{
				console.log("Hechizo acabado: "+out);
				console.log(this.text.substring(this.it-out.length,this.it));
				ret_text += this.text.substring(last_pos,this.it-out.length-1)+"<strong>"+spell_html+"</strong>";
				last_pos = this.it+1;
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
				console.log("Añado "+this.modifiers[elem_or_mod]+" a out");
				console.log("mod_open = "+mod_open);
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
				console.log("Añado "+this.elements[elem_or_mod]+" a out");
				spell_html += "<i class='MWWElement-"+this.elements[elem_or_mod]+"'></i>";
				out += this.elements[elem_or_mod];
			}
			continue;
		}
		console.log("cancelling because char "+this.text[this.it]+" is not an element nor modifier");
		cancel_spell = true;
	}
	console.log("Acción acabada");
	ret_text += this.text.substring(last_pos, this.text.length);
	return ret_text;
};

//var body = document.getElementsByTagName("body")[0];
//body.innerHTML = ParseSpells(body.innerHTML);

var posts = document.getElementsByClassName("postbody");
for (var i = 0; i < posts.length; i++)
{
	posts[i].innerHTML = ParseSpells(posts[i].innerHTML);
};

//console.log(ParseSpells("Lightning - 19<br>AAA<br>AAW, AAR, AAS, AAF<br>AWW, ARR, ASS, AFF<br>ASF, ASR, AWF, AWR<br>AA<br>"));