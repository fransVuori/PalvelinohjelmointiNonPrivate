# --- VAIHE 1: RAKENNA FRONTEND ("Builder") ---
# Käytetään node:18-alpine pohjana ja nimetään se "builder"
FROM node:18-alpine AS builder

# Aseta työkansio frontendille
WORKDIR /app/frontend

# Kopioi frontendin riippuvuustiedostot
COPY frontend/package.json frontend/package-lock.json ./

# Asenna frontend-riippuvuudet (mukaan lukien 'vite' yms. devDependencies)
RUN npm install

# Kopioi loput frontend-koodista
COPY frontend/ ./

# Rakenna staattiset tiedostot ('npm run build' tekee 'dist'-kansion)
RUN npm run build
# Tämän vaiheen tuloksena on kansio /app/frontend/dist


# --- VAIHE 2: RAKENNA LOPULLINEN IMAG ("Production") ---
# Aloita alusta puhtaalla imagella
FROM node:18-alpine

WORKDIR /app

# Kopioi backend-riippuvuudet
COPY package.json package-lock.json ./

# Asenna *vain* tuotantoriippuvuudet backendille
RUN npm install --omit=dev

# Kopioi backend-koodi ja tietokannat
COPY index.js .
COPY db-tiedostot ./db-tiedostot

# Kopioi staattiset tiedostot "builder"-vaiheesta (vaihe 1)
# Kopiomme ne /app/frontend/dist -> /app/public
# Nyt index.js:n express.static(path.join(__dirname, 'public')) löytää ne
COPY --from=builder /app/frontend/dist ./public

# Paljasta portti, jota sovellus kuuntelee
EXPOSE 3001

# Käynnistä backend-palvelin
CMD [ "node", "index.js" ]