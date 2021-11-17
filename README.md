# IteratifBARKER
The place to become riche ?

## Setup environement

### NVM setup
`https://github.com/coreybutler/nvm-windows/releases`

```
nvm install 10.13.0
nvm use 10.13.0
```

### Project setup
Run ``npm install`` in root and in iteratifBarker-front folder
may change to node 10.13.0 cause of angular with graph.js

## Script 
- ``npm run build`` to compile
- ``npm run bot-launch`` to execute bot
- ``npm run bot`` to compile and execute bot
- ``npm run server`` to launch servers on port 4200

`See the package.json script`

## Architecture

L'architecture est composée de trois element principaux, le serveur Angular, le serveur Express et le code du bot. 

### Angular

Angular est un framework javascript qui sert uniquement à générer du frontend. Tout le code est executer coté client (dans le navigateur de l'utilisateur), c'est une architecture dynamique.

#### Difference Statique / Dynamique
La difference entre architecture dynamique et statique est principalement qu'en dynamique c'est coté client qu'on fait les appels API, qu'on récupere les données et qu'on les traites, c'est ensuite qu'on modifie le HTML dynamiquement en fonction des données récupérées (d'où le nom). Alors qu'en statique tout est process sur le serveur puis le code HTML, CSS, Javascript est envoyé complet au client. On ne modifie pas le HTML, il est statique.

#### Commande Angular
Avec Angular, la commande `ng serv` permet de créer un server sur `http:localhost:4200` c'est uniquement le front. 

### Express

Express est un framework javascript qui sert à faire le backend.
On le lance le serveur avec `node dist/src/server.js` sur `http:localhost:8080`.

### Bot

Tout les fichier du bot sont dans `./src`. Le bot est écrit en TypeScript, donc le language doit être compilé en javascript pour pouvoir être executé. Les fichiers compilés se trouve dans `./dist` toute les configurations de compilation sont dans le fichier `./tsconfig.json`.

Le code est executé depuis `./src/index.js` dans le main, le main est executé si on lance le fichier `./src/index.js` sinon il est executé depuis le serveur lorsqu'il s'initialise.

### Lancement des deux serveurs

On monte un proxy sur le serveur angular qui redirige toute les requettes avec l'url `./api/*` sur le serveur express. La config du proxy ce trouve ici `./iteratifBarker-front/proxy.config.json` et on lance le serveur angular avec `ng serve --proxy-config proxy.config.json` depuis le fichier Angular. Il faut aussi lancer le serveur express pour que le proxy puisse faire la redirection.

## Documentation

### Binance client ts
https://www.npmjs.com/package/binance-api-node

### tsconfig
https://www.typescriptlang.org/docs/handbook/tsconfig-json.html
https://www.typescriptlang.org/tsconfig