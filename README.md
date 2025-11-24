# PalvelinohjelmointiNonPrivate

docker build -t menu-sovellus .

docker run -d -p 3001:3001 --name menu-kontti menu-sovellus