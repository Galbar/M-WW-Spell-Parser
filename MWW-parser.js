var elements = ["Q", "W", "E", "R", "A", "S", "D", "F", "X"];
var modifiers = ["[", "]", "!", "c"];
var separators = [" ", "<", ">", "+", ","];
//var text = "I was bored so I compiled a list of every single unique spell in WW with the 8 elements and noting the ones that cancel out. Turns out you can cast 120 different spells! And that's not all! You can cast any of them in two different ways: Normal Cast (RMB) and Self Cast (MMB)! Now, after updating I should have them all.<br><br>On a side note, when writing spells to your fellow Magickans, the list below is compiled in the most readable spell format. The first element in the spell defines the type of spell that is created. You can quickly know ASF is a lightning type spell because of the first element. E of course denotes some kind of shield, wall, mine or barrier. The second letter after the E denotes the type of those four. EDS is a barrier since D is in the middle. ESR are mines because S is in the middle.<br><br>Now, when actually casting in the game, the order doesn't matter. When talking about spells in text or out loud, having an order the elements go in is a very good practice.<br><br>Shield - 32<br>EQQ, EWW, ERR, EAA, ESS, EDD, EFF, EQR, EQF   <br>EDQ, EDW, EDR, EDS, EDF               <br>EAW, EAR, EAS, EAF                    <br>ESQ, ESF, ESR                           <br>EWQ, EWR, EWF                        <br>EQ, EW, ER, EA, ES, ED, EF<br>E<br><br>Projectiles - 31<br>DDD <br>DDQ, DDW, DDR, DDS, DDF<br>DQQ, DWW, DRR, DSS, DFF<br>DSF, DSR, DSQ<br>DWF, DWR, DWQ<br>DQF, DQR<br>DD<br>DQ, DW, DR, DS, DF<br>D<br>QRS, QRW, QRQ, QRR<br>QR<br><br>Lightning - 19<br>AAA<br>AAW, AAR, AAS, AAF<br>AWW, ARR, ASS, AFF<br>ASF, ASR, AWF, AWR<br>AA<br>AW, AR, AS, AF<br>A<br><br>Beams - 26<br>SSS, WWW<br>SSQ, SSR, SSF<br>WWQ, WWR, WWF<br>SQQ, SRR, SFF, SQF<br>WQQ, WRR, WFF, WQF<br>SS, WW<br>SQ, SR, SF<br>WQ, WR, WF<br>S<br>W<br><br>Sprays - 12<br>FFF, QQQ, RRR<br>FQF, FQQ<br>QQ, FF, RR<br>FQ<br>F, Q, R<br><br>Total = 120<br>Normal cast + Selfcast = Total * 2 = 226						</blockquote>					</div>									</div>			</div>";

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
				console.log("cancelling spell "+out);
				for (; it < text.length && isSeparator(text[it]) >= 0; it++);

				it--;
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