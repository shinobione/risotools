# risotools

Outils personnels pour les interventions RISO / ASTEA.

## ASTEA V8 Mobile

Fichier : `astea/astea-v8-mobile.js`

Le script s'exécute dans la page ASTEA Mobile Edge et :

- ouvre la Work List ;
- lit les interventions et leurs Overview ;
- ouvre Inventory ;
- extrait le stock disponible (`Available > 0`) ;
- génère un Live Pack ;
- compare avec le scan précédent via `localStorage` pour signaler les changements.

### Bookmarklet Android

Créer un favori Chrome nommé `ASTEA LIVE`, puis mettre comme URL :

```javascript
javascript:(async()=>{try{eval(await(await fetch('https://raw.githubusercontent.com/shinobione/risotools/main/astea/astea-v8-mobile.js?v='+Date.now())).text())}catch(e){alert('ASTEA loader: '+e.message)}})()
```

Pour le lancer dans Chrome Android : ouvrir ASTEA, toucher la barre d'adresse, taper `ASTEA LIVE`, puis sélectionner le favori dans les suggestions.

### Données

Le dépôt contient uniquement le code. Les données de Work List / stock ne sont pas envoyées vers GitHub par ce script. La baseline de comparaison reste dans le `localStorage` du navigateur.
