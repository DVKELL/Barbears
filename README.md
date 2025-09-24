#Uri de MongoDB
MONGODB_URI = mongodb+srv://Daikell:admin@barbears.scsuvph.mongodb.net/?retryWrites=true&w=majority&appName=BARBEARS

#Puerto donde corre el backend
PORT = 4000

#Token con larga duracion de 15 dias
ACCESS_TOKEN_TTL_MIN=15

#Token con corta duracion de 7 dias
REFRESH_TOKEN_TTL_DAYS=7

#Acces token
ACCESS_TOKEN_TTL_MIN=15

#Origen del frontend
CORS_ORIGIN=http://localhost:5173


AUTO_CONFIRM=0

DEV_FAKE_AUTH=1

#Firma del token de acceso
JWT_ACCESS_SECRET=supersecreto

#Firma del refresh token
JWT_REFRESH_SECRET=supersecreto_ref

#Minimo de horas para cancelar una cita 
CANCEL_MIN_HOURS=2
