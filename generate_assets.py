import os
from PIL import Image, ImageOps

# Source paths
brain_dir = r'C:\Users\jaiveer\.gemini\antigravity-ide\brain\ae1921ba-9218-4dc7-8586-dddd278a7abf'
icon_src_path = os.path.join(brain_dir, 'media__1785032630230.jpg')
wm_src_path = os.path.join(brain_dir, 'media__1785032630260.png')

# Output directories
out_dirs = [
    r'c:\Users\jaiveer\Downloads\insaas\public',
    r'c:\Users\jaiveer\Downloads\insaas\public\assets\branding',
    r'c:\Users\jaiveer\Downloads\insaas\src\assets\branding'
]

for d in out_dirs:
    os.makedirs(d, exist_ok=True)

# Load sources
icon_img = Image.open(icon_src_path).convert('RGBA')
wm_img = Image.open(wm_src_path).convert('RGBA')

# Remove the 4 outer white corners AND the white border stroke around the squircle
def make_transparent_corners(img):
    img = img.convert('RGBA')
    width, height = img.size
    radius = int(width * 0.24) # ~245px corner arc region

    pixels = img.load()
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]

            # Check 4 outer corner regions
            in_top_left = (x < radius and y < radius)
            in_top_right = (x > width - radius and y < radius)
            in_bottom_left = (x < radius and y > height - radius)
            in_bottom_right = (x > width - radius and y > height - radius)

            if in_top_left or in_top_right or in_bottom_left or in_bottom_right:
                cx = radius if x < radius else (width - radius)
                cy = radius if y < radius else (height - radius)
                dist = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5

                # 1. Any pixel outside the rounded navy squircle curve -> 100% transparent
                if dist > radius - 15:
                    # If pixel is white / light outline border (not navy #162A3B and not orange #FF6B3D)
                    # Navy background is ~R:15-30, G:30-45, B:50-65
                    if r > 100 or g > 100 or b > 100:
                        # Exclude the orange dot (r > 200, g < 150) if it touches corner
                        if not (r > 200 and g < 150 and b < 100):
                            pixels[x, y] = (0, 0, 0, 0)
                elif dist > radius:
                    pixels[x, y] = (0, 0, 0, 0)

    return img


icon_img = make_transparent_corners(icon_img)




print(f"Loaded icon: {icon_img.size}, wordmark: {wm_img.size}")


# 1. Create transparent version of wordmark by thresholding white background
def make_transparent_wordmark(img):
    img = img.convert('RGBA')
    datas = img.getdata()
    new_data = []
    for item in datas:
        r, g, b, a = item
        # If pixel is close to white (background), set alpha to 0
        if r > 240 and g > 240 and b > 240:
            new_data.append((255, 255, 255, 0))
        else:
            # Calculate anti-aliasing alpha for edge pixels
            avg = (r + g + b) / 3.0
            if avg > 200:
                alpha = int(255 * (255 - avg) / 55.0)
                alpha = max(0, min(255, alpha))
                new_data.append((r, g, b, alpha))
            else:
                new_data.append((r, g, b, 255))
    img.putdata(new_data)
    return img

wm_trans = make_transparent_wordmark(wm_img)

# 2. Create Dark Version (White text, Orange dot)
def make_dark_wordmark(img_trans):
    dark_wm = img_trans.copy()
    datas = dark_wm.getdata()
    new_data = []
    for item in datas:
        r, g, b, a = item
        if a > 0:
            # Check if pixel is Orange dot (r > 200 and g < 150)
            if r > 200 and g < 150 and b < 100:
                new_data.append((255, 107, 61, a)) # Warm orange #FF6B3D
            else:
                new_data.append((255, 255, 255, a)) # White text #FFFFFF
        else:
            new_data.append((0, 0, 0, 0))
    dark_wm.putdata(new_data)
    return dark_wm

# 3. Create Light Version (Deep Navy text, Orange dot)
def make_light_wordmark(img_trans):
    light_wm = img_trans.copy()
    datas = light_wm.getdata()
    new_data = []
    for item in datas:
        r, g, b, a = item
        if a > 0:
            if r > 200 and g < 150 and b < 100:
                new_data.append((255, 107, 61, a)) # Warm orange #FF6B3D
            else:
                new_data.append((22, 42, 59, a)) # Deep Navy #162A3B
        else:
            new_data.append((0, 0, 0, 0))
    light_wm.putdata(new_data)
    return light_wm

# 4. Create Monochrome Black Version
def make_mono_black_wordmark(img_trans):
    mono_b = img_trans.copy()
    datas = mono_b.getdata()
    new_data = []
    for item in datas:
        r, g, b, a = item
        if a > 0:
            new_data.append((0, 0, 0, a))
        else:
            new_data.append((0, 0, 0, 0))
    mono_b.putdata(new_data)
    return mono_b

# 5. Create Monochrome White Version
def make_mono_white_wordmark(img_trans):
    mono_w = img_trans.copy()
    datas = mono_w.getdata()
    new_data = []
    for item in datas:
        r, g, b, a = item
        if a > 0:
            new_data.append((255, 255, 255, a))
        else:
            new_data.append((0, 0, 0, 0))
    mono_w.putdata(new_data)
    return mono_w

wm_dark = make_dark_wordmark(wm_trans)
wm_light = make_light_wordmark(wm_trans)
wm_mono_b = make_mono_black_wordmark(wm_trans)
wm_mono_w = make_mono_white_wordmark(wm_trans)

# Save Wordmark variants to public/assets/branding & src/assets/branding
branding_paths = [
    r'c:\Users\jaiveer\Downloads\insaas\public\assets\branding',
    r'c:\Users\jaiveer\Downloads\insaas\src\assets\branding'
]

for b_path in branding_paths:
    wm_img.save(os.path.join(b_path, 'kontagi-wordmark.png'))
    wm_trans.save(os.path.join(b_path, 'kontagi-wordmark-transparent.png'))
    wm_light.save(os.path.join(b_path, 'kontagi-wordmark-light.png'))
    wm_dark.save(os.path.join(b_path, 'kontagi-wordmark-dark.png'))
    wm_mono_b.save(os.path.join(b_path, 'kontagi-wordmark-mono-black.png'))
    wm_mono_w.save(os.path.join(b_path, 'kontagi-wordmark-mono-white.png'))

print("Saved wordmark PNG variants successfully!")

# Save App Icon sizes
sizes = [16, 32, 48, 64, 128, 180, 192, 256, 512, 1024]
for s in sizes:
    resized_icon = icon_img.resize((s, s), Image.Resampling.LANCZOS)
    for b_path in branding_paths:
        resized_icon.save(os.path.join(b_path, f'kontagi-icon-{s}x{s}.png'))
    
    # Save standard PWA / Favicon / Apple Touch locations in public/
    pub = r'c:\Users\jaiveer\Downloads\insaas\public'
    if s == 16:
        resized_icon.save(os.path.join(pub, 'favicon-16x16.png'))
    elif s == 32:
        resized_icon.save(os.path.join(pub, 'favicon-32x32.png'))
    elif s == 48:
        resized_icon.save(os.path.join(pub, 'favicon-48x48.png'))
    elif s == 180:
        resized_icon.save(os.path.join(pub, 'apple-touch-icon.png'))
    elif s == 192:
        resized_icon.save(os.path.join(pub, 'icon-192.png'))
    elif s == 512:
        resized_icon.save(os.path.join(pub, 'icon-512.png'))

# Save favicon.ico (multi-resolution 16, 32, 48)
icon_img.save(
    os.path.join(r'c:\Users\jaiveer\Downloads\insaas\public', 'favicon.ico'),
    format='ICO',
    sizes=[(16, 16), (32, 32), (48, 48)]
)

print("Saved icon PNG sizes and favicon.ico successfully!")
