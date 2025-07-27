Protocolo: https
Direccion de swagger: https://localhost:44347/swagger/index.html





Autenticación
POST /api/Auth/register
Registra un nuevo usuario en el sistema.

Request Body:

json
{
"email": "string",
"password": "string"
}
Respuesta:

200: Registro exitoso

POST /api/Auth/login
Inicia sesión en el sistema.

Request Body:

json
{
"email": "string",
"password": "string"
}
Respuesta:

200: Inicio de sesión exitoso

Bautizos
GET /api/Bautizo
Obtiene todos los registros de bautizos.

Respuesta:

json
[
{
"id": 0,
"miembroId": 0,
"fecha": "2025-07-27T19:25:58.349Z",
"lugar": "string",
"pastorOficiante": "string"
}
]
POST /api/Bautizo
Crea un nuevo registro de bautizo.

Request Body:

json
{
"id": 0,
"miembroId": 0,
"fecha": "2025-07-27T19:25:58.350Z",
"lugar": "string",
"pastorOficiante": "string"
}
PUT /api/Bautizo/{id}
Actualiza un registro de bautizo existente.

Parámetros:

id: ID del bautizo a actualizar

Request Body:

json
{
"id": 0,
"miembroId": 0,
"fecha": "2025-07-27T19:25:58.351Z",
"lugar": "string",
"pastorOficiante": "string"
}
DELETE /api/Bautizo/{id}
Elimina un registro de bautizo.

Parámetros:

id: ID del bautizo a eliminar

Eventos
GET /api/Evento
Obtiene todos los eventos registrados.

Respuesta:

json
[
{
"id": 0,
"nombre": "string",
"tipo": "string",
"fecha": "2025-07-27T19:25:58.354Z",
"lugar": "string"
}
]
POST /api/Evento
Crea un nuevo evento.

Request Body:

json
{
"id": 0,
"nombre": "string",
"tipo": "string",
"fecha": "2025-07-27T19:25:58.355Z",
"lugar": "string"
}
PUT /api/Evento/{id}
Actualiza un evento existente.

Parámetros:

id: ID del evento a actualizar

Request Body:

json
{
"id": 0,
"nombre": "string",
"tipo": "string",
"fecha": "2025-07-27T19:25:58.356Z",
"lugar": "string"
}
DELETE /api/Evento/{id}
Elimina un evento.

Parámetros:

id: ID del evento a eliminar

Miembros
GET /api/Miembro
Obtiene todos los miembros registrados.

Respuesta:

json
[
{
"id": 0,
"nombre": "string",
"apellido": "string",
"cedula": "string",
"fechaNacimiento": "2025-07-27",
"fechaIngreso": "2025-07-27",
"sexo": "string",
"direccion": "string",
"telefono": "string",
"correo": "user@example.com",
"activo": true
}
]
POST /api/Miembro
Registra un nuevo miembro.

Request Body:

json
{
"id": 0,
"nombre": "string",
"apellido": "string",
"cedula": "string",
"fechaNacimiento": "2025-07-27",
"fechaIngreso": "2025-07-27",
"sexo": "string",
"direccion": "string",
"telefono": "string",
"correo": "user@example.com",
"activo": true
}
PUT /api/Miembro/{id}
Actualiza los datos de un miembro.

Parámetros:

id: ID del miembro a actualizar

Request Body:

json
{
"id": 0,
"nombre": "string",
"apellido": "string",
"cedula": "string",
"fechaNacimiento": "2025-07-27",
"fechaIngreso": "2025-07-27",
"sexo": "string",
"direccion": "string",
"telefono": "string",
"correo": "user@example.com",
"activo": true
}
DELETE /api/Miembro/{id}
Elimina un miembro.

Parámetros:

id: ID del miembro a eliminar

Ministerios
GET /api/Ministerio
Obtiene todos los ministerios registrados.

Respuesta:

json
[
{
"id": 0,
"nombre": "string",
"descripcion": "string"
}
]
POST /api/Ministerio
Crea un nuevo ministerio.

Request Body:

json
{
"id": 0,
"nombre": "string",
"descripcion": "string"
}
PUT /api/Ministerio/{id}
Actualiza un ministerio existente.

Parámetros:

id: ID del ministerio a actualizar

Request Body:

json
{
"id": 0,
"nombre": "string",
"descripcion": "string"
}
DELETE /api/Ministerio/{id}
Elimina un ministerio.

Parámetros:

id: ID del ministerio a eliminar

Transacciones
GET /api/Transaccion
Obtiene todas las transacciones registradas.

Respuesta:

json
[
{
"id": 0,
"miembroId": 0,
"tipo": "string",
"monto": 2147483647,
"fecha": "2025-07-27",
"observacion": "string"
}
]
POST /api/Transaccion
Registra una nueva transacción.

Request Body:

json
{
"id": 0,
"miembroId": 0,
"tipo": "string",
"monto": 2147483647,
"fecha": "2025-07-27",
"observacion": "string"
}
PUT /api/Transaccion/{id}
Actualiza una transacción existente.

Parámetros:

id: ID de la transacción a actualizar

Request Body:

json
{
"id": 0,
"miembroId": 0,
"tipo": "string",
"monto": 2147483647,
"fecha": "2025-07-27",
"observacion": "string"
}
DELETE /api/Transaccion/{id}
Elimina una transacción.

Parámetros:

id: ID de la transacción a eliminar

Visitantes
GET /api/Visitante
Obtiene todos los visitantes registrados.

Respuesta:

json
[
{
"id": 0,
"nombre": "string",
"apellido": "string",
"telefono": "string",
"fechaVisita": "2025-07-27",
"eventoId": 0
}
]
POST /api/Visitante
Registra un nuevo visitante.

Request Body:

json
{
"id": 0,
"nombre": "string",
"apellido": "string",
"telefono": "string",
"fechaVisita": "2025-07-27",
"eventoId": 0
}
PUT /api/Visitante/{id}
Actualiza los datos de un visitante.

Parámetros:

id: ID del visitante a actualizar

Request Body:

json
{
"id": 0,
"nombre": "string",
"apellido": "string",
"telefono": "string",
"fechaVisita": "2025-07-27",
"eventoId": 0
}
DELETE /api/Visitante/{id}
Elimina un visitante.

Parámetros:

id: ID del visitante a eliminar
