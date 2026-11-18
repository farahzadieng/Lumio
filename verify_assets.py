from pathlib import Path
import json,xml.etree.ElementTree as ET
root=Path(__file__).resolve().parent
layers=json.loads((root/'assets/living-world/scene-manifest.json').read_text())['layers']
assert len(layers)==60 and len({x['id'] for x in layers})==60
for layer in layers:
 p=root/layer['file']; assert p.is_file(),p
 r=ET.parse(p).getroot(); assert r.attrib.get('viewBox')=='0 0 390 520',p
for mood in ['idle','smile','sad','angry','happy','dance','sleepy','curious']:
 ET.parse(root/'assets/paper-guest'/f'{mood}.svg')
 assert (root/'assets/paper-guest'/f'{mood}.gif').exists()
 assert (root/'assets/paper-guest'/f'{mood}.webp').exists()
assert (root/'assets/icons/lumio-original-square.png').exists()
assert not list((root/'assets').rglob('*.riv'))
print('PASS: 60 independent scene SVG layers, 8 guest expressions, approved icon, no Rive')
