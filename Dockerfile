# Utiliser une image Node officielle
FROM node:18-alpine

# Créer un dossier dans le conteneur
WORKDIR /app

# Copier les fichiers nécessaires
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste de l'application
COPY . .

# L'application écoute sur le port 3000
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "start"]
