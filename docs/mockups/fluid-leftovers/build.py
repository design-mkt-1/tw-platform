# Builds index.html from the shots in img/ and the numbers in measure.json.
# Both come from scripts/.opt-tmp.mjs (not committed): the live site at 390/440/480, each option
# applied as CSS or DOM over the real page, then the element screenshotted and measured.
import json

M = json.load(open('measure.json', encoding='utf-8'))
W = [390, 440, 480]


def meas(piece, opt):
    out = []
    for w in W:
        m = M[piece][opt][str(w)]
        if piece == 'match':
            s = f"{w}: {m['h']:g}px înalt, EP {m['sizes'][0]}, 1/Н/2 {m['sizes'][1]}"
        else:
            s = f"{w}: {m['h']:g}px înalt"
            if piece == 'partners':
                s += f", rânduri {m['rows']}"
            elif 'scroll' in m:
                s += ", se derulează" if m['scroll'] else f", {max(m['empty'], 0)}px gol în dreapta"
        out.append(s)
    return '<br>'.join(out)


def shots(piece, opt):
    return ''.join(
        f'<div class="w">{w}px</div><img src="img/{piece}-{opt}-{w}.png" alt="{piece} {opt} la {w}px" style="max-width:{w}px">'
        for w in W)


def block(piece, opt, tag, title, why, gain, rec):
    t = f'<span class="tag">{tag}</span>' + ('<span class="tag rec">RECOMANDAT</span>' if rec else '')
    g = f'<p class="gain">{gain}</p>' if gain else ''
    return (f'<div class="opt"><div class="head">{t}<h3>{title}</h3></div><p class="why">{why}</p>'
            f'<div class="bleed">{shots(piece, opt)}</div><p class="m">{meas(piece, opt)}</p>{g}</div>')


S = [
    ('2', 'Banda „Рекомендовані ліги” pe /sport', 'leagues', [
        ('acum', 'ACUM', 'Plăcuțele se opresc', 'La 390 banda iese din ecran spre dreapta, ca în design. De la 440 în sus se oprește înainte de margine și rămâne un gol.', None, False),
        ('a', 'A', 'Mai multe plăcuțe', '10 plăcuțe în loc de 8. Banda iese din ecran la orice lățime, ca la 390.', '<b>Câștigi:</b> la 390 nu se schimbă niciun pixel vizibil, iar la 480 arată ca designul. <b>Pierzi:</b> toate plăcuțele au aceeași siglă Europa League, singura din Figma. Acum sunt 10 la fel în loc de 8.', True),
        ('b', 'B', 'Plăcuțe distanțate', 'Tot 8 plăcuțe, dar spațiul dintre ele crește până umple rândul.', '<b>Câștigi:</b> fără plăcuțe în plus. <b>Pierzi:</b> la 480 spațiul dintre plăcuțe e 11px în loc de 4, și se vede tot rândul, deci nu mai pare că banda continuă.', False),
        ('c', 'C', 'Plăcuțe mai mari', 'Plăcuțele cresc odată cu telefonul, cum cresc deja cartonașele de joc.', '<b>Câștigi:</b> banda iese din ecran ca în design. <b>Pierzi:</b> banda devine mai înaltă, 90px → 104px la 480, iar plăcuțele ies mai mari decât iconițele sporturilor de deasupra.', False),
    ]),
    ('3', 'Rândul de meci pe /sport: <code>● EP</code> și <code>1 / Н / 2</code>', 'match', [
        ('acum', 'ACUM', '10px lângă 12px', 'Ora a trecut la 12px (decizia ta), dar <code>● EP</code>, pe același rând, și <code>1 / Н / 2</code>, deasupra cotelor, au rămas la 10px, ca în Figma.', None, False),
        ('a', 'A', 'Totul la 12px', '<code>● EP</code> și <code>1 / Н / 2</code> trec la 12px.', '<b>Câștigi:</b> un singur corp de literă în tot rândul. <b>Pierzi:</b> rândul crește cu 1px (81 → 82), iar <code>1 / Н / 2</code> devin la fel de mari ca numele echipelor.', False),
        ('b', 'B', 'Doar <code>● EP</code> la 12px', 'Rândul cu ora devine uniform. <code>1 / Н / 2</code> rămân la 10px, ca în design.', '<b>Câștigi:</b> rândul care se vedea amestecat e rezolvat, iar înălțimea rămâne 81px. <b>Pierzi:</b> <code>1 / Н / 2</code> rămân mici. Dar stau singure deasupra cotelor, lângă nimic de 12px.', True),
        ('c', 'C', 'Amândouă la 11px', 'Un pas la mijloc, pentru ambele.', '<b>Câștigi:</b> diferența de mărime se vede mai puțin. <b>Pierzi:</b> 11px nu apare nicăieri altundeva în rând, deci rândul are acum trei mărimi: 11, 12 și 14.', False),
    ]),
    ('4', 'Furnizorii din căutare (<code>?panel=search</code>)', 'search', [
        ('acum', 'ACUM', 'Rândul nu se umple', '5 cercuri a câte 80px ocupă 400px. La 390 rândul se derulează, ca în design. La 480 rămân 48px goi în dreapta, iar barele de dedesubt tot arată că s-ar derula, deși nu e nimic de derulat.', None, False),
        ('a', 'A', 'Cercurile se răsfiră', 'Cercurile rămân de 72px, dar fiecare primește o parte egală din rând.', '<b>Câștigi:</b> la 390 nu se schimbă nimic, iar peste 440 rândul e plin. <b>Pierzi:</b> la 440 și 480 rândul nu se mai derulează, deci barele de sub el nu mai au ce arăta.', True),
        ('b', 'B', 'Cercuri mai mari', 'Totul crește cu telefonul, iar rândul se derulează la orice lățime.', '<b>Câștigi:</b> barele de sub rând au sens la orice lățime. <b>Pierzi:</b> panoul crește, 110px → 132px la 480, iar cercurile ies mai mari decât restul panoului.', False),
        ('c', 'C', 'Pe mijloc', 'Cele 5 cercuri se centrează, cu gol egal în stânga și în dreapta.', '<b>Câștigi:</b> golul nu mai stă doar într-o parte. <b>Pierzi:</b> rămân tot 24px goi pe fiecare parte la 480, iar barele arată în continuare o derulare care nu există.', False),
    ]),
    ('5', '„Наші партнери” din footer', 'partners', [
        ('acum', 'ACUM', '3 + 4 la 480', 'La 390 și 440 logourile stau 3 + 3 + 1, ca în design. La 480 al patrulea încape pe primul rând și se rearanjează în 3 + 4.', None, False),
        ('a', 'A', '3 + 3 + 1 mereu', 'Rândul nu primește niciodată loc pentru 4 logouri.', '<b>Câștigi:</b> la orice lățime arată ca designul. <b>Pierzi:</b> la 480 blocul e mai înalt decât acum, 134px → 182px, adică exact cât la 390.', True),
        ('c', 'B', 'Logouri mai mari', 'Logourile cresc cu telefonul și rămân 3 + 3 + 1.', '<b>Câștigi:</b> umplu lățimea. <b>Pierzi:</b> footerul crește, 182px → 206px la 480, iar logourile partenerilor ies mai mari decât cele de plată de deasupra.', False),
    ]),
]

body = ''.join(
    f'<section><h2><span class="num">{n}</span>{t}</h2>' + ''.join(block(p, *o) for o in opts) + '</section>'
    for n, t, p, opts in S)

html = '''<title>Top-Win — ce rămâne de ales peste 390</title>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<style>
:root{--bg:#f7faff;--ink:#191970;--muted:#5b5f86;--line:#dfe5f2;--ok:#0a7a3d}
*{box-sizing:border-box} html{scrollbar-width:none}
body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.45 system-ui,sans-serif}
main{max-width:520px;margin:0 auto;padding-block:20px 60px;padding-inline:16px}
h1{font-size:21px;margin:0 0 8px;line-height:1.25} h2{font-size:19px;margin:0 0 4px;line-height:1.3} h3{font-size:16px;margin:0}
code{font:13px ui-monospace,Consolas,monospace}
ol{margin:8px 0 0;padding-left:20px;color:var(--muted)}
section{margin-top:34px;padding-top:18px;border-top:2px solid var(--line)}
.num{display:inline-grid;place-items:center;width:26px;height:26px;border-radius:50%;background:var(--ink);color:#fff;font-size:14px;margin-right:8px;vertical-align:2px}
.opt{margin-top:22px}
.head{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.tag{font:700 11px/1 system-ui;letter-spacing:.04em;padding:5px 7px;border-radius:6px;background:#e7ebf6;color:var(--ink)}
.tag.rec{background:var(--ok);color:#fff}
.why{margin:6px 0 4px} .gain{margin:8px 0 0;color:var(--muted)}
.bleed{margin-inline:-16px}
.w{font:600 12px/1 system-ui;color:var(--muted);margin:12px 16px 6px}
.bleed img{display:block;width:100%;height:auto;background:#fff}
.m{font:12px/1.5 ui-monospace,Consolas,monospace;margin:8px 0 0}
</style>
<main>
<h1>Patru lucruri mici peste 390</h1>
<p>Pagina se întinde acum până la 480. La 390 totul e ca în Figma. Mai late de atât, patru locuri arată altfel decât în design.</p>
<ol>
<li><b>ACUM</b>: poze de pe site-ul publicat, la 390, 440 (iPhone-ul tău) și 480.</li>
<li><b>A, B, C</b>: aceeași pagină reală, cu varianta aplicată peste ea și fotografiată. Fonturile, logourile și meciurile sunt cele din aplicație.</li>
<li>Sub fiecare variantă sunt cifrele măsurate: înălțimea și cât loc rămâne gol.</li>
<li>Alegi în chat câte o variantă pentru fiecare, apoi scriu codul.</li>
</ol>
''' + body + '''
<p class="gain" style="margin-top:30px">Pozele mai late decât ecranul tău sunt micșorate ca să încapă. Pe un telefon de 440, doar pozele de 480 sunt micșorate.</p>
</main>'''

open('index.html', 'w', encoding='utf-8', newline='\n').write('<!doctype html>\n<html lang="ro">\n' + html + '\n</html>\n')
