# Traductions

Le **français est écrit en clair dans le HTML** : le site reste lisible sans
JavaScript, et les moteurs de recherche voient le vrai texte. Les autres langues
vivent ici, dans un fichier JSON par langue.

| Fichier | Langue | État |
|---|---|---|
| `fr.json` | Français | Référence. Reflète le texte du HTML. |
| `en.json` | Anglais | Livré. |
| `nl.json` | Néerlandais | **À faire** — voir ci-dessous. |

## Ajouter une langue

1. Copier `en.json` sous le nouveau code (`nl.json` pour le néerlandais) et
   traduire les valeurs. **Ne pas toucher aux clés.**
2. Dans `assets/js/i18n.js`, ajouter le code à la liste :
   `var LANGUES = ['fr', 'en', 'nl'];`
3. Dans les six pages HTML, ajouter le bouton à côté de `FR` et `EN` :
   `<button type="button" data-lang="nl">NL</button>`

Rien d’autre à modifier.

## Règles de rédaction

- Les clés absentes d’un dictionnaire retombent automatiquement sur le français :
  une traduction incomplète n’affiche jamais de clé brute à l’écran.
- Les valeurs peuvent contenir du HTML simple (`<em>`, `<strong>`, `<a>`, `<br>`).
  **Conserver les balises présentes dans la version française.**
- `&nbsp;` est l’espace insécable. En français, il en faut un avant `: ; ! ?`
  et à l’intérieur des guillemets `«  »`. En anglais, uniquement entre un
  nombre et son unité.
- Les clés `alt.*` sont les descriptions des photos, lues par les lecteurs
  d’écran. Elles décrivent ce que montre l’image, pas ce qu’on veut vendre.

## Vérifier avant de livrer

Les deux dictionnaires doivent avoir exactement les mêmes clés :

```bash
python3 - <<'PY'
import json
fr = json.load(open('assets/i18n/fr.json'))
for code in ('en',):          # ajouter 'nl' le moment venu
    d = json.load(open(f'assets/i18n/{code}.json'))
    manque, trop = set(fr) - set(d), set(d) - set(fr)
    print(code, 'manquantes :', sorted(manque) or 'aucune')
    print(code, 'en trop    :', sorted(trop) or 'aucune')
PY
```
