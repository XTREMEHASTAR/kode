import os

pub_dir = r'c:\Users\jaiveer\Downloads\insaas\public'
brand_pub = r'c:\Users\jaiveer\Downloads\insaas\public\assets\branding'
brand_src = r'c:\Users\jaiveer\Downloads\insaas\src\assets\branding'

PRIMARY_NAVY = "#13233F"  # Deep Navy
ACCENT_ORANGE = "#FF6B35" # Brand Accent Orange

# 1. Clean App Icon (Favicon / App Icon)
APP_ICON_SVG = f'''<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" rx="220" fill="{PRIMARY_NAVY}"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M220 220H475V435L675 220H910L590 535L925 804H675L475 580V804H220V220Z" fill="#FAF8F3"/>
  <rect x="720" y="140" width="148" height="148" rx="24" fill="{ACCENT_ORANGE}"/>
</svg>'''

# 2. Perfected Enterprise Vector Wordmark (KONTAGI.)
# - Clean, perfectly balanced G path without overlapping horizontal artifact strokes
# - High clarity geometric letterforms (K, O, N, T, A, G, I)
# - ViewBox: 1860 x 320 for optimal spacing
WORDMARK_CLEAN_SVG = f'''<svg width="1860" height="320" viewBox="0 0 1860 320" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g fill="{PRIMARY_NAVY}">
    <!-- K -->
    <path fill-rule="evenodd" clip-rule="evenodd" 
          d="M 40 40 H 104 V 152 L 182 40 H 264 L 168 172 L 272 290 H 190 L 104 192 V 290 H 40 V 40 Z"/>

    <!-- O -->
    <path fill-rule="evenodd" clip-rule="evenodd" 
          d="M 440 35 C 512 35 568 91 568 165 C 568 239 512 295 440 295 C 368 295 312 239 312 165 C 312 91 368 35 440 35 Z M 440 98 C 402 98 376 124 376 165 C 376 206 402 232 440 232 C 478 232 504 206 504 165 C 504 124 478 98 440 98 Z"/>

    <!-- N -->
    <path fill-rule="evenodd" clip-rule="evenodd" 
          d="M 620 40 H 682 L 768 200 V 40 H 830 V 290 H 768 L 682 130 V 290 H 620 V 40 Z"/>

    <!-- T -->
    <path fill-rule="evenodd" clip-rule="evenodd" 
          d="M 885 40 H 1045 V 98 H 996 V 290 H 934 V 98 H 885 V 40 Z"/>

    <!-- A -->
    <path fill-rule="evenodd" clip-rule="evenodd" 
          d="M 1150 40 H 1228 L 1305 290 H 1240 L 1225 238 H 1153 L 1138 290 H 1073 L 1150 40 Z M 1189 110 L 1168 182 H 1210 L 1189 110 Z"/>

    <!-- G (Clean Enterprise Geometry: Perfect Curved Outer Arch, Clean Counter & Solid Inset Crossbar) -->
    <path fill-rule="evenodd" clip-rule="evenodd" 
          d="M 1475 35 
             C 1555 35 1615 90 1615 165 
             V 290 
             H 1548 
             V 185 
             H 1485 
             V 128 
             H 1615 
             C 1600 88 1545 98 1475 98 
             C 1435 98 1410 125 1410 165 
             C 1410 205 1435 232 1475 232 
             C 1515 232 1542 208 1548 185 
             H 1615 
             C 1605 245 1555 295 1475 295 
             C 1395 295 1345 239 1345 165 
             C 1345 91 1395 35 1475 35 Z" 
          stroke="none"/>

    <!-- I -->
    <path fill-rule="evenodd" clip-rule="evenodd" 
          d="M 1665 40 H 1727 V 290 H 1665 V 40 Z"/>
  </g>

  <!-- Accent Orange Squircle Period (#FF6B35) -->
  <rect x="1755" y="240" width="46" height="46" rx="12" fill="{ACCENT_ORANGE}"/>
</svg>'''

for d in [brand_pub, brand_src]:
    os.makedirs(d, exist_ok=True)
    with open(os.path.join(d, 'kontagi-icon.svg'), 'w', encoding='utf-8') as f:
        f.write(APP_ICON_SVG)
    with open(os.path.join(d, 'kontagi-wordmark-vector.svg'), 'w', encoding='utf-8') as f:
        f.write(WORDMARK_CLEAN_SVG)

print("Generated clean perfected G wordmark SVG!")
