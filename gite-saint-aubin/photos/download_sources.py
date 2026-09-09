#!/usr/bin/env python3
"""
Telecharge les photos du gite depuis les sources publiques.
Necessite un acces reseau sortant (Claude Code l'a ; le bac a sable Cowork ne l'a pas).

    python photos/download_sources.py
    python photos/download_sources.py --airbnb https://www.airbnb.fr/rooms/12345678

Sorties :
    originaux/10-wix-site-actuel/    7 photos du site Wix (grandes : jusqu'a 4032x3024)
    originaux/11-adt-ardennes/       17 photos de la fiche ADT (petites, depannage)
    originaux/12-airbnb/             photos de l'annonce Airbnb, si l'URL est fournie
"""
import argparse, json, re, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MAN = json.loads((ROOT / "manifest.json").read_text(encoding="utf-8"))
SRC = MAN["sources_externes"]
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                   "(KHTML, like Gecko) Chrome/126.0 Safari/537.36"}


def get(url, timeout=30):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=timeout).read()


def save(data, path):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)
    print(f"  ok       {path.name}  ({len(data) // 1024} Ko)")


def wix():
    print("\n[Wix — site actuel]")
    dest = ROOT / "originaux" / "10-wix-site-actuel"
    for f in SRC["wix"]["fichiers"]:
        out = dest / f.replace("~", "_")
        if out.exists():
            print(f"  deja la  {out.name}"); continue
        try:
            save(get(SRC["wix"]["base"] + f), out)
        except Exception as e:
            print(f"  ECHEC    {f} -> {e}")


def adt():
    """Les URLs portent la taille en suffixe. On tente plus grand avant de se rabattre."""
    print("\n[ADT Ardennes — fiche touristique]")
    dest = ROOT / "originaux" / "11-adt-ardennes"
    variantes = ["-1920x1280", "-1600x1200", "-1200x800", "-800x520"]
    for f in SRC["adt_ardennes"]["fichiers"]:
        stem = re.sub(r"-\d+x\d+(?=\.)", "", f)          # hash.webp
        base_hash, ext = stem.rsplit(".", 1)
        out = dest / f"{base_hash}.{ext}"
        if out.exists():
            print(f"  deja la  {out.name}"); continue
        for v in variantes + [""]:
            url = SRC["adt_ardennes"]["base"] + f"{base_hash}{v}.{ext}"
            try:
                data = get(url, timeout=20)
                if len(data) > 2000:
                    save(data, out)
                    if v: print(f"           (variante {v})")
                    break
            except Exception:
                continue
        else:
            print(f"  ECHEC    {f}")


def airbnb(url=None):
    """Telecharge les photos de l'annonce. La liste est deja dans manifest.json ;
    on ne rescrape la page que si elle est vide."""
    conf = SRC["airbnb"]
    dest = ROOT / "originaux" / "12-airbnb"
    fichiers = conf.get("fichiers") or []
    url = url or conf.get("url_annonce")
    print(f"\n[Airbnb — {conf.get('titre','annonce')}]  {url or 'URL inconnue'}")

    if not fichiers and url:
        print("  liste vide, tentative de lecture de la page...")
        try:
            html = get(url, timeout=45).decode("utf-8", "ignore")
            fichiers = sorted(set(re.findall(
                r"a0\.muscache\.com/im/pictures/([^\"'?\s]+?\.(?:jpe?g|webp))", html)))
            fichiers = [f for f in fichiers if "AirbnbPlatformAssets" not in f and "/user/" not in f]
        except Exception as e:
            print(f"  ECHEC    page inaccessible -> {e}")
            print("  Repli manuel : ouvrir l'annonce, F12 > Reseau > filtrer 'muscache'.")
            return

    if not fichiers:
        print("  Rien a telecharger.")
        return

    print(f"  {len(fichiers)} photo(s)")
    for i, f in enumerate(fichiers, 1):
        ext = "." + f.rsplit(".", 1)[-1]
        out = dest / f"airbnb-{i:02d}{ext}"
        if out.exists():
            print(f"  deja la  {out.name}"); continue
        for cand in (conf["base"] + f + "?im_w=1920", conf["base"] + f):
            try:
                save(get(cand), out); break
            except Exception:
                continue
        else:
            print(f"  ECHEC    {f[:60]}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--airbnb", help="URL de l'annonce Airbnb du gite")
    ap.add_argument("--skip-wix", action="store_true")
    ap.add_argument("--skip-adt", action="store_true")
    a = ap.parse_args()

    if not a.skip_wix: wix()
    if not a.skip_adt: adt()
    airbnb(a.airbnb)

    print("\nRelance ensuite import_photos.py pour generer les versions web.")
