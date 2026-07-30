import os
from PIL import Image, ImageDraw, ImageFont

# Directory paths
pub_dir = r'c:\Users\jaiveer\Downloads\insaas\public'
brand_pub = r'c:\Users\jaiveer\Downloads\insaas\public\assets\branding'
brand_src = r'c:\Users\jaiveer\Downloads\insaas\src\assets\branding'

# 1. Generate Open Graph Image (1200 x 630)
og_img = Image.new('RGBA', (1200, 630), (250, 248, 243, 255)) # Warm Off White #FAF8F3
draw = ImageDraw.Draw(og_img)

# Load wordmark light version
wm_light = Image.open(os.path.join(brand_pub, 'kontagi-wordmark-light.png'))
wm_w, wm_h = wm_light.size
# Scale wordmark to width ~ 600px
scale = 600.0 / wm_w
new_w, new_h = int(wm_w * scale), int(wm_h * scale)
wm_resized = wm_light.resize((new_w, new_h), Image.Resampling.LANCZOS)

# Paste centered at x=300, y=200
og_img.paste(wm_resized, (300, 180), wm_resized)

# Add tagline text below
# Draw subtitled text using default font or shape
draw.text((600, 360), "Creative Intelligence Platform", fill=(102, 112, 133, 255), anchor="mm")

og_img.save(os.path.join(pub_dir, 'og-image.png'))
print("Generated og-image.png successfully!")

# 2. Generate SVG for App Icon
app_icon_svg = '''<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" rx="220" fill="#162A3B"/>
  <!-- Vector K Letterform matching exact KONTAGI geometric K -->
  <path fill-rule="evenodd" clip-rule="evenodd" d="M220 220H475V435L675 220H910L590 535L925 804H675L475 580V804H220V220Z" fill="#FAF8F3"/>
  <!-- Warm Orange Square Dot on top right of K -->
  <rect x="720" y="140" width="148" height="148" rx="24" fill="#FF6B3D"/>
</svg>'''

# 3. Generate SVG for Wordmark (Light / Navy)
wordmark_svg = '''<svg width="1024" height="337" viewBox="0 0 1024 337" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- KONTAGI Wordmark SVG -->
  <!-- K -->
  <path d="M40 50 H120 V155 L180 50 H260 L160 170 L265 285 H180 L120 200 V285 H40 V50 Z" fill="#162A3B"/>
  <!-- O -->
  <path fill-rule="evenodd" clip-rule="evenodd" d="M285 167.5 C285 102.6 337.6 50 402.5 50 C467.4 50 520 102.6 520 167.5 C520 232.4 467.4 285 402.5 285 C337.6 285 285 232.4 285 167.5 Z M440 167.5 C440 146.8 423.2 130 402.5 130 C381.8 130 365 146.8 365 167.5 C365 188.2 381.8 205 402.5 205 C423.2 205 440 188.2 440 167.5 Z" fill="#162A3B"/>
  <!-- N -->
  <path d="M540 50 H610 L685 200 V50 H750 V285 H680 L605 135 V285 H540 V50 Z" fill="#162A3B"/>
  <!-- T -->
  <path d="M770 50 H930 V110 H880 V285 H820 V110 H770 V50 Z" fill="#162A3B"/>
  <!-- A -->
  <path fill-rule="evenodd" clip-rule="evenodd" d="M30 340" fill="#162A3B"/>
</svg>'''

for d in [brand_pub, brand_src]:
    with open(os.path.join(d, 'kontagi-icon.svg'), 'w', encoding='utf-8') as f:
        f.write(app_icon_svg)

print("Generated SVGs successfully!")
