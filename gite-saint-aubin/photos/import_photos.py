#!/usr/bin/env python3
"""
Range les photos de Claire Hugerot et genere les versions web.

Usage :
    python photos/import_photos.py                       # lit photos/_inbox/
    python photos/import_photos.py "%USERPROFILE%\\Downloads"   # + un dossier en plus

Un dossier passe en argument n'est PAS vide de son contenu : seuls les fichiers
listes dans manifest.json en sont copies. Le reste est ignore.

Resultat :
    photos/originaux/<dossier>/<fichier>.jpg   copie fidele
    photos/web/<dossier>/<nom>-1600.jpg|.webp  version site
    photos/web/<dossier>/<nom>-800.jpg|.webp   version mobile
    photos/photos.json                          inventaire avec dimensions reelles

Le script est idempotent : relance-le autant de fois que tu veux.
"""
import argparse, json, shutil, sys, zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
INBOX = ROOT / "_inbox"
ORIG = ROOT / "originaux"
WEB = ROOT / "web"
MANIFEST = ROOT / "manifest.json"
TAILLES = [1600, 800]
QUALITE_JPG = 82
QUALITE_WEBP = 80

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Pillow manquant.  ->  pip install pillow")

if not MANIFEST.exists():
    sys.exit(f"manifest.json introuvable dans {ROOT}")

man = json.loads(MANIFEST.read_text(encoding="utf-8"))
fmap = man["fichier_vers_dossier"]

ap = argparse.ArgumentParser()
ap.add_argument("sources", nargs="*", help="dossiers supplementaires a scanner (filtres par le manifeste)")
args = ap.parse_args()
extras = [Path(x).expanduser() for x in args.sources]

INBOX.mkdir(parents=True, exist_ok=True)

# 1. dezipper tout ce qui traine dans _inbox
for z in sorted(INBOX.rglob("*.zip")):
    cible = z.with_suffix("")
    if cible.exists():
        continue
    print(f"  dezip  {z.name}")
    try:
        with zipfile.ZipFile(z) as zf:
            zf.extractall(cible)
    except zipfile.BadZipFile:
        print(f"  !! {z.name} n'est pas un zip valide, ignore")

# 2. ranger
EXT = (".jpg", ".jpeg", ".png", ".heic", ".webp")
candidats = [(f, False) for f in sorted(INBOX.rglob("*"))]
for d in extras:
    if not d.is_dir():
        print(f"  !! dossier introuvable : {d}")
        continue
    print(f"  scan     {d} (filtre par le manifeste)")
    candidats += [(f, True) for f in sorted(d.glob("*")) if f.name in fmap]

trouves, inconnus = {}, []
for img, strict in candidats:
    if not img.is_file() or img.suffix.lower() not in EXT:
        continue
    info = fmap.get(img.name)
    if info is None:
        if strict:
            continue
        inconnus.append(img)
        dossier = "00-hors-manifeste"
    else:
        dossier = info["dossier"]
    dest = ORIG / dossier / img.name
    dest.parent.mkdir(parents=True, exist_ok=True)
    if not dest.exists():
        shutil.copy2(img, dest)
    trouves[img.name] = dossier

# 3. versions web
inventaire = []
for src in sorted(ORIG.rglob("*")):
    if not src.is_file() or src.suffix.lower() not in (".jpg", ".jpeg", ".png", ".webp"):
        continue
    dossier = src.parent.name
    base = src.stem
    try:
        im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    except Exception as e:
        print(f"  !! illisible : {src.name} ({e})")
        continue
    w, h = im.size
    variantes = []
    for t in TAILLES:
        if w <= t and h <= t and t != min(TAILLES):
            continue
        copie = im.copy()
        copie.thumbnail((t, t), Image.LANCZOS)
        outdir = WEB / dossier
        outdir.mkdir(parents=True, exist_ok=True)
        j = outdir / f"{base}-{t}.jpg"
        wp = outdir / f"{base}-{t}.webp"
        if not j.exists():
            copie.save(j, "JPEG", quality=QUALITE_JPG, optimize=True, progressive=True)
        if not wp.exists():
            copie.save(wp, "WEBP", quality=QUALITE_WEBP, method=6)
        variantes.append({"largeur_max": t, "jpg": str(j.relative_to(ROOT)).replace("\\", "/"),
                          "webp": str(wp.relative_to(ROOT)).replace("\\", "/"),
                          "w": copie.size[0], "h": copie.size[1]})
    meta = fmap.get(src.name, {})
    inventaire.append({
        "fichier": src.name,
        "dossier": dossier,
        "categorie": meta.get("categorie", "inconnu"),
        "sujet_mail": meta.get("sujet_mail", ""),
        "original": str(src.relative_to(ROOT)).replace("\\", "/"),
        "w": w, "h": h,
        "orientation": "paysage" if w >= h else "portrait",
        "alt_fr": man.get("descriptions", {}).get(src.name, ""),  # a completer apres avoir regarde la photo
        "alt_en": "",
        "variantes": variantes,
    })

(ROOT / "photos.json").write_text(
    json.dumps({"projet": man["projet"], "photos": inventaire}, ensure_ascii=False, indent=2),
    encoding="utf-8")

attendus = set(fmap)
presents = set(trouves) | {f.name for f in ORIG.rglob("*") if f.is_file()}
manquants = sorted(attendus - presents)

print(f"\n{len(inventaire)} photo(s) traitee(s), {len(attendus)} attendue(s).")
if manquants:
    print(f"\nMANQUANTES ({len(manquants)}) - le mail correspondant n'a pas ete telecharge :")
    for m in manquants:
        print(f"  - {m}   [{fmap[m]['sujet_mail']}]")
if inconnus:
    print(f"\nHORS MANIFESTE ({len(inconnus)}) - rangees dans originaux/00-hors-manifeste/ :")
    for i in inconnus:
        print(f"  - {i.name}")
print("\nInventaire ecrit dans photos/photos.json.")
print("Prochaine etape : ouvrir les photos, remplir alt_fr / alt_en, verifier les categories.")
