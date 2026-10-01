"""
Class Bunker - Android Asset Generator
Generates:
1. Adaptive & Legacy App Launcher Icons (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi)
2. Splash Screens (portrait and landscape for all density buckets)
3. PWA Icons (192x192, 512x512)
"""

import os
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RES_DIR = os.path.join(BASE_DIR, "android", "app", "src", "main", "res")
ICONS_DIR = os.path.join(BASE_DIR, "icons")
WWW_ICONS_DIR = os.path.join(BASE_DIR, "www", "icons")

def draw_class_bunker_logo(size, is_foreground=False):
    """Draw high-resolution Class Bunker logo"""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    margin = size * 0.08
    if not is_foreground:
        # Rounded background rectangle
        bg_color = (13, 17, 23, 255) # Deep navy #0D1117
        draw.rounded_rectangle([margin, margin, size - margin, size - margin], radius=int(size * 0.22), fill=bg_color)
        
        # Outer vibrant glow border
        draw.rounded_rectangle([margin, margin, size - margin, size - margin], radius=int(size * 0.22), outline=(99, 102, 241, 180), width=max(2, int(size * 0.02)))

    # Center emblem: Shield with bunker / mortarboard elements
    cx, cy = size / 2, size / 2
    s_w = size * 0.30
    s_top = size * 0.22
    s_mid = size * 0.52
    s_bot = size * 0.78

    shield_pts = [
        (cx, s_top),
        (cx + s_w, s_top + s_w * 0.35),
        (cx + s_w * 0.85, s_mid),
        (cx, s_bot),
        (cx - s_w * 0.85, s_mid),
        (cx - s_w, s_top + s_w * 0.35)
    ]
    # Shield fill (indigo / violet gradient look)
    draw.polygon(shield_pts, fill=(79, 70, 229, 255))
    draw.polygon(shield_pts, outline=(129, 140, 248, 255))

    # Inner bunker safe checkmark / pillar
    chk_top = [
        (cx, s_top + size * 0.12),
        (cx + s_w * 0.6, s_top + size * 0.22),
        (cx, s_top + size * 0.32),
        (cx - s_w * 0.6, s_top + size * 0.22)
    ]
    draw.polygon(chk_top, fill=(99, 102, 241, 255))

    # Safe Green badge indicator at center
    g_rad = size * 0.08
    draw.ellipse([cx - g_rad, cy + size * 0.05 - g_rad, cx + g_rad, cy + size * 0.05 + g_rad], fill=(46, 160, 67, 255), outline=(255, 255, 255, 220), width=max(1, int(size * 0.015)))

    # Checkmark inside green dot
    chk_pts = [
        (cx - g_rad * 0.45, cy + size * 0.05),
        (cx - g_rad * 0.1, cy + size * 0.05 + g_rad * 0.4),
        (cx + g_rad * 0.5, cy + size * 0.05 - g_rad * 0.35)
    ]
    draw.line(chk_pts, fill=(255, 255, 255, 255), width=max(2, int(size * 0.02)))

    return img

def draw_splash(width, height):
    """Draw responsive splash screen with centered Class Bunker branding"""
    img = Image.new("RGBA", (width, height), (13, 17, 23, 255)) # #0D1117 background
    draw = ImageDraw.Draw(img)

    # Logo size proportional to smaller dimension
    logo_size = int(min(width, height) * 0.35)
    logo = draw_class_bunker_logo(logo_size, is_foreground=False)

    lx = (width - logo_size) // 2
    ly = (height - logo_size) // 2 - int(min(width, height) * 0.05)
    img.paste(logo, (lx, ly), logo)

    # Title & Tagline text
    cx = width // 2
    text_y = ly + logo_size + int(min(width, height) * 0.04)

    # Draw app name using default drawing
    font_size = max(18, int(min(width, height) * 0.055))
    try:
        font = ImageFont.truetype("arial.ttf", font_size)
        sub_font = ImageFont.truetype("arial.ttf", max(11, int(font_size * 0.45)))
    except Exception:
        font = ImageFont.load_default()
        sub_font = ImageFont.load_default()

    title_text = "Class Bunker"
    tagline_text = "Bunk smart. Stay eligible."

    title_bbox = draw.textbbox((0, 0), title_text, font=font)
    title_w = title_bbox[2] - title_bbox[0]
    draw.text((cx - title_w // 2, text_y), title_text, fill=(240, 246, 252, 255), font=font)

    tag_bbox = draw.textbbox((0, 0), tagline_text, font=sub_font)
    tag_w = tag_bbox[2] - tag_bbox[0]
    draw.text((cx - tag_w // 2, text_y + font_size + 6), tagline_text, fill=(139, 148, 158, 255), font=sub_font)

    return img

def main():
    print("Generating Class Bunker Android & PWA Visual Assets...")

    # 1. PWA & Web Icons
    os.makedirs(ICONS_DIR, exist_ok=True)
    os.makedirs(WWW_ICONS_DIR, exist_ok=True)
    for s in [192, 512]:
        pwa_icon = draw_class_bunker_logo(s)
        p1 = os.path.join(ICONS_DIR, f"icon-{s}.png")
        p2 = os.path.join(WWW_ICONS_DIR, f"icon-{s}.png")
        pwa_icon.save(p1, "PNG")
        pwa_icon.save(p2, "PNG")
        print(f"  [OK] Saved {p1}")

    # 2. Android Launcher Icons (Legacy and Adaptive)
    densities = {
        "mipmap-mdpi": (48, 108),
        "mipmap-hdpi": (72, 162),
        "mipmap-xhdpi": (96, 216),
        "mipmap-xxhdpi": (144, 324),
        "mipmap-xxxhdpi": (192, 432),
    }

    for folder, (legacy_s, fore_s) in densities.items():
        dir_path = os.path.join(RES_DIR, folder)
        os.makedirs(dir_path, exist_ok=True)

        # Standard icon
        icon_img = draw_class_bunker_logo(legacy_s)
        icon_img.save(os.path.join(dir_path, "ic_launcher.png"), "PNG")
        icon_img.save(os.path.join(dir_path, "ic_launcher_round.png"), "PNG")

        # Foreground for adaptive icon
        fore_img = draw_class_bunker_logo(fore_s, is_foreground=True)
        fore_img.save(os.path.join(dir_path, "ic_launcher_foreground.png"), "PNG")
        print(f"  [OK] Generated {folder} icons (legacy: {legacy_s}px, adaptive: {fore_s}px)")

    # 3. Android Splash Screens (Portrait & Landscape)
    splash_buckets = {
        "drawable": (480, 800),
        "drawable-port-mdpi": (320, 480),
        "drawable-port-hdpi": (480, 800),
        "drawable-port-xhdpi": (720, 1280),
        "drawable-port-xxhdpi": (960, 1600),
        "drawable-port-xxxhdpi": (1280, 1920),
        "drawable-land-mdpi": (480, 320),
        "drawable-land-hdpi": (800, 480),
        "drawable-land-xhdpi": (1280, 720),
        "drawable-land-xxhdpi": (1600, 960),
        "drawable-land-xxxhdpi": (1920, 1280),
    }

    for folder, (w, h) in splash_buckets.items():
        dir_path = os.path.join(RES_DIR, folder)
        os.makedirs(dir_path, exist_ok=True)
        splash_img = draw_splash(w, h)
        splash_file = os.path.join(dir_path, "splash.png")
        splash_img.save(splash_file, "PNG")
        print(f"  [OK] Generated {folder}/splash.png ({w}x{h})")

    print("\n[OK] All Android icons and splash assets successfully generated!")

if __name__ == "__main__":
    main()
