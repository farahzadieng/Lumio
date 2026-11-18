"""Export Bon's existing vertical one as a Persian-only compatibility face."""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools import subset

root = Path(__file__).resolve().parents[1]
font = TTFont(root / 'public/fonts/Bon-Bold.woff2')
vertical_one = font.getBestCmap()[0x0031]
for table in font['cmap'].tables:
    if table.isUnicode():
        table.cmap[0x06F1] = vertical_one
        table.cmap[0x0661] = vertical_one

options = subset.Options()
options.name_IDs = [1, 2, 4, 6]
subsetter = subset.Subsetter(options=options)
subsetter.populate(unicodes=[0x06F1, 0x0661])
subsetter.subset(font)
for name_id, value in [(1, 'Bon Persian One'), (2, 'Bold'), (4, 'Bon Persian One Bold'), (6, 'Bon-Persian-One-Bold')]:
    font['name'].setName(value, name_id, 3, 1, 0x409)
font.flavor = 'woff2'
font.save(root / 'public/fonts/Bon-Persian-One.woff2')
