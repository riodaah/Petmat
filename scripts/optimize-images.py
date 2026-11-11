"""Genera versiones WebP (1200 px y 600 px) de cada PNG de producto.

Uso:  python3 scripts/optimize-images.py     (requiere Pillow: pip install pillow)
Córrelo cada vez que agregues fotos a public/assets/products/.
"""
import glob
from PIL import Image

for path in sorted(glob.glob('public/assets/products/*/*.png')):
    image = Image.open(path).convert('RGBA')
    background = Image.new('RGBA', image.size, 'white')
    background.alpha_composite(image)
    image = background.convert('RGB')
    for width, suffix in ((1200, ''), (600, '-600')):
        resized = image if image.width <= width else image.resize(
            (width, round(image.height * width / image.width)), Image.LANCZOS)
        resized.save(f'{path[:-4]}{suffix}.webp', 'WEBP', quality=80, method=6)
    print('ok', path)
