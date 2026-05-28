# Bonnys API

API REST para administrar clientes, usuarios, servicios, productos, citas, ingresos y gastos de Bonnys.

## Tecnologias

- Node.js
- Express
- MySQL
- JWT para autenticacion
- bcrypt para validar contrasenas

## Instalacion

```bash
npm install
```

## Variables de entorno

Crear un archivo `.env` en la raiz del proyecto con estas variables:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=usuario
DB_PASSWORD=password
DB_NAME=bonnys

JWT_SECRET=secreto
JWT_EXPIRES_IN=1d
```

## Ejecucion

```bash
npm run dev
```

Para produccion:

```bash
npm start
```

La API escucha por defecto en:

```text
http://localhost:3000
```

## Formato general

Las respuestas exitosas usan este formato:

```json
{
  "mensaje": "Operacion realizada correctamente",
  "data": {}
}
```

Los errores usan este formato:

```json
{
  "mensaje": "Descripcion del error",
  "error": "Detalle tecnico opcional"
}
```

## Autenticacion

Todas las rutas bajo `/api/usuarios`, `/api/clientes`, `/api/servicios`, `/api/productos`, `/api/citas`, `/api/ingresos` y `/api/gastos` requieren token JWT.

Enviar el token en el header:

```http
Authorization: Bearer <token>
```

Si no se envia token:

```json
{
  "mensaje": "Token no proporcionado"
}
```

Si el formato no es valido:

```json
{
  "mensaje": "Formato de token invalido"
}
```

Si el token no es valido o expiro:

```json
{
  "mensaje": "Token invalido o expirado"
}
```

## Endpoints publicos

### `GET /`

Verifica que la API este activa.

Respuesta:

```json
{
  "mensaje": "API de Bonnys funcionando correctamente"
}
```

### `GET /api/test-db`

Verifica la conexion con MySQL.

Respuesta exitosa:

```json
{
  "mensaje": "Conexion a MySQL correcta",
  "data": {
    "fecha_actual": "2026-05-27T00:00:00.000Z"
  }
}
```

## Auth

Base path: `/api/auth`

### `POST /api/auth/login`

Inicia sesion y devuelve un JWT.

No requiere token.

Body:

```json
{
  "nombre_usuario": "admin",
  "password": "admin123"
}
```

Campos:

| Campo | Tipo | Requerido | Descripcion |
| --- | --- | --- | --- |
| `nombre_usuario` | string | Si | Nombre de usuario registrado. |
| `password` | string | Si | Contrasena en texto plano para validar con bcrypt. |

Respuesta `200`:

```json
{
  "mensaje": "Login correcto",
  "data": {
    "token": "<jwt>",
    "usuario": {
      "id_usuario": 1,
      "nombre": "Admin",
      "apellido": "Principal",
      "correo": "admin@bonnys.com",
      "nombre_usuario": "admin",
      "rol": "ADMIN",
      "estado": true
    }
  }
}
```

Respuesta `401`:

```json
{
  "mensaje": "Usuario o contrasena incorrectos"
}
```

## Usuarios

Base path: `/api/usuarios`

Requiere `Authorization: Bearer <token>`.

### Campos del recurso

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| `id_usuario` | number | Identificador del usuario. |
| `nombre` | string | Nombre. |
| `apellido` | string | Apellido. |
| `telefono1` | string/null | Telefono principal. |
| `telefono2` | string/null | Telefono secundario. |
| `correo` | string/null | Correo electronico. |
| `nombre_usuario` | string | Usuario para login. |
| `password` | string | Contrasena almacenada. Para login debe estar en hash bcrypt. |
| `rol` | string | Rol del usuario. |
| `estado` | boolean | Estado activo/inactivo. Por defecto `true`. |
| `url_foto` | string/null | URL de foto. |
| `fecha_registro` | datetime | Fecha de registro. |

### `GET /api/usuarios`

Lista todos los usuarios.

Respuesta `200`:

```json
{
  "mensaje": "Usuarios obtenidos correctamente",
  "data": []
}
```

### `GET /api/usuarios/:id`

Obtiene un usuario por `id_usuario`.

Respuesta `200`:

```json
{
  "mensaje": "Usuario obtenido correctamente",
  "data": {
    "id_usuario": 1,
    "nombre": "Admin",
    "apellido": "Principal",
    "telefono1": null,
    "telefono2": null,
    "correo": "admin@bonnys.com",
    "nombre_usuario": "admin",
    "rol": "ADMIN",
    "estado": true,
    "url_foto": null,
    "fecha_registro": "2026-05-27T00:00:00.000Z"
  }
}
```

Respuesta `404`:

```json
{
  "mensaje": "Usuario no encontrado"
}
```

### `POST /api/usuarios`

Crea un usuario.

Body:

```json
{
  "nombre": "Ana",
  "apellido": "Lopez",
  "telefono1": "55555555",
  "telefono2": null,
  "correo": "ana@example.com",
  "nombre_usuario": "ana",
  "password": "$2b$10$hashbcrypt",
  "rol": "ADMIN",
  "estado": true,
  "url_foto": null
}
```

Campos requeridos: `nombre`, `apellido`, `nombre_usuario`, `password`, `rol`.

Campos opcionales: `telefono1`, `telefono2`, `correo`, `estado`, `url_foto`.

Respuesta `201`:

```json
{
  "mensaje": "Usuario creado correctamente",
  "data": {}
}
```

Respuesta `400`:

```json
{
  "mensaje": "Datos incompletos. Nombre, apellido, nombre_usuario, password y rol son obligatorios"
}
```

### `PUT /api/usuarios/:id`

Actualiza un usuario. Los campos son opcionales; si no se envian se conserva el valor actual.

Body:

```json
{
  "nombre": "Ana Maria",
  "apellido": "Lopez",
  "telefono1": "55555555",
  "telefono2": "44444444",
  "correo": "ana@example.com",
  "nombre_usuario": "ana",
  "rol": "ADMIN",
  "estado": true,
  "url_foto": "https://example.com/foto.jpg"
}
```

Nota: este endpoint no actualiza `password`.

Respuesta `200`:

```json
{
  "mensaje": "Usuario actualizado correctamente",
  "data": {}
}
```

Respuesta `404`:

```json
{
  "mensaje": "Usuario no encontrado o id invalido"
}
```

### `DELETE /api/usuarios/:id`

Elimina un usuario.

Respuesta `200`:

```json
{
  "mensaje": "Usuario eliminado correctamente",
  "data": {}
}
```

Respuesta `404`:

```json
{
  "mensaje": "Usuario no encontrado o id invalido"
}
```

## Clientes

Base path: `/api/clientes`

Requiere `Authorization: Bearer <token>`.

### Campos del recurso

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| `id_cliente` | number | Identificador del cliente. |
| `nombre` | string | Nombre. |
| `apellido` | string | Apellido. |
| `telefono1` | string/null | Telefono principal. |
| `telefono2` | string/null | Telefono secundario. |
| `correo` | string/null | Correo electronico. |
| `direccion` | string/null | Direccion. |

### `GET /api/clientes`

Lista clientes ordenados por `id_cliente DESC`.

Respuesta `200`:

```json
{
  "mensaje": "Clientes obtenidos correctamente",
  "data": []
}
```

### `GET /api/clientes/:id`

Obtiene un cliente por `id_cliente`.

Respuesta `404`:

```json
{
  "mensaje": "Cliente no encontrado"
}
```

### `POST /api/clientes`

Crea un cliente.

Body:

```json
{
  "nombre": "Maria",
  "apellido": "Perez",
  "telefono1": "55555555",
  "telefono2": null,
  "correo": "maria@example.com",
  "direccion": "Guatemala"
}
```

Campos requeridos: `nombre`, `apellido`.

Campos opcionales: `telefono1`, `telefono2`, `correo`, `direccion`.

Respuesta `201`:

```json
{
  "mensaje": "Cliente creado correctamente",
  "data": {}
}
```

Respuesta `400`:

```json
{
  "mensaje": "Datos incompletos. Nombre y apellido son obligatorios"
}
```

### `PUT /api/clientes/:id`

Actualiza un cliente. Los campos son opcionales.

Body:

```json
{
  "nombre": "Maria",
  "apellido": "Perez",
  "telefono1": "55555555",
  "telefono2": "44444444",
  "correo": "maria@example.com",
  "direccion": "Guatemala"
}
```

Respuesta `200`:

```json
{
  "mensaje": "Cliente actualizado correctamente",
  "data": {}
}
```

Respuesta `404`:

```json
{
  "mensaje": "Cliente no encontrado o id invalido"
}
```

### `DELETE /api/clientes/:id`

Elimina un cliente.

Respuesta `200`:

```json
{
  "mensaje": "Cliente eliminado correctamente",
  "data": {}
}
```

## Servicios

Base path: `/api/servicios`

Requiere `Authorization: Bearer <token>`.

### Campos del recurso

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| `id_servicio` | number | Identificador del servicio. |
| `nombre` | string | Nombre del servicio. |
| `descripcion` | string/null | Descripcion. |
| `precio` | number | Precio del servicio. |
| `duracion_minutos` | number | Duracion en minutos. |
| `estado` | boolean | Estado activo/inactivo. Por defecto `true`. |
| `url_foto` | string/null | URL de foto. |
| `url_video` | string/null | URL de video. |

### `GET /api/servicios`

Lista servicios ordenados por `id_servicio DESC`.

Respuesta `200`:

```json
{
  "mensaje": "Servicios obtenidos correctamente",
  "data": []
}
```

### `GET /api/servicios/:id`

Obtiene un servicio por `id_servicio`.

Respuesta `404`:

```json
{
  "mensaje": "Servicio no encontrado"
}
```

### `POST /api/servicios`

Crea un servicio.

Body:

```json
{
  "nombre": "Corte",
  "descripcion": "Corte de cabello",
  "precio": 75.0,
  "duracion_minutos": 45,
  "estado": true,
  "url_foto": null,
  "url_video": null
}
```

Campos requeridos: `nombre`, `precio`, `duracion_minutos`.

Campos opcionales: `descripcion`, `estado`, `url_foto`, `url_video`.

Respuesta `201`:

```json
{
  "mensaje": "Servicio creado correctamente",
  "data": {}
}
```

Respuesta `400`:

```json
{
  "mensaje": "Nombre, precio y duracion son obligatorios"
}
```

### `PUT /api/servicios/:id`

Actualiza un servicio. Los campos son opcionales.

Body:

```json
{
  "nombre": "Corte premium",
  "descripcion": "Corte y lavado",
  "precio": 100.0,
  "duracion_minutos": 60,
  "estado": true,
  "url_foto": "https://example.com/servicio.jpg",
  "url_video": null
}
```

Respuesta `200`:

```json
{
  "mensaje": "Servicio actualizado correctamente",
  "data": {}
}
```

### `DELETE /api/servicios/:id`

Elimina un servicio.

Respuesta `200`:

```json
{
  "mensaje": "Servicio eliminado correctamente",
  "data": {}
}
```

## Productos

Base path: `/api/productos`

Requiere `Authorization: Bearer <token>`.

### Campos del recurso

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| `id_producto` | number | Identificador del producto. |
| `nombre` | string | Nombre del producto. |
| `descripcion` | string/null | Descripcion. |
| `precio_venta` | number | Precio de venta. |
| `stock_actual` | number | Stock actual. Por defecto `0`. |
| `stock_minimo` | number | Stock minimo. Por defecto `0`. |
| `estado` | boolean | Estado activo/inactivo. Por defecto `true`. |
| `url_foto` | string/null | URL de foto. |
| `url_video` | string/null | URL de video. |

### `GET /api/productos`

Lista productos ordenados por `id_producto DESC`.

Respuesta `200`:

```json
{
  "mensaje": "Productos obtenidos correctamente",
  "data": []
}
```

### `GET /api/productos/:id`

Obtiene un producto por `id_producto`.

Respuesta `404`:

```json
{
  "mensaje": "Producto no encontrado"
}
```

### `POST /api/productos`

Crea un producto.

Body:

```json
{
  "nombre": "Shampoo",
  "descripcion": "Shampoo profesional",
  "precio_venta": 120.0,
  "stock_actual": 10,
  "stock_minimo": 2,
  "estado": true,
  "url_foto": null,
  "url_video": null
}
```

Campos requeridos: `nombre`, `precio_venta`.

Campos opcionales: `descripcion`, `stock_actual`, `stock_minimo`, `estado`, `url_foto`, `url_video`.

Respuesta `201`:

```json
{
  "mensaje": "Producto creado correctamente",
  "data": {}
}
```

Respuesta `400`:

```json
{
  "mensaje": "Nombre y precio_venta son obligatorios"
}
```

### `PUT /api/productos/:id`

Actualiza un producto. Los campos son opcionales.

Body:

```json
{
  "nombre": "Shampoo",
  "descripcion": "Shampoo profesional",
  "precio_venta": 125.0,
  "stock_actual": 8,
  "stock_minimo": 2,
  "estado": true,
  "url_foto": "https://example.com/producto.jpg",
  "url_video": null
}
```

Respuesta `200`:

```json
{
  "mensaje": "Producto actualizado correctamente",
  "data": {}
}
```

### `DELETE /api/productos/:id`

Elimina un producto.

Respuesta `200`:

```json
{
  "mensaje": "Producto eliminado correctamente",
  "data": {}
}
```

## Citas

Base path: `/api/citas`

Requiere `Authorization: Bearer <token>`.

### Campos del recurso

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| `id_cita` | number | Identificador de la cita. |
| `id_cliente` | number | Cliente asignado. |
| `cliente` | string | Nombre completo del cliente en listados. |
| `id_usuario` | number | Usuario asignado. |
| `usuario` | string | Nombre completo del usuario en listados. |
| `id_servicio` | number | Servicio asignado. |
| `servicio` | string | Nombre del servicio en listados. |
| `fecha_cita` | date/string | Fecha de la cita. |
| `hora_inicio` | time/string | Hora de inicio. |
| `hora_fin` | time/string | Hora de fin. |
| `estado` | string | Estado de la cita. Por defecto `PENDIENTE`. |
| `observaciones` | string/null | Observaciones. |
| `fecha_registro` | datetime | Fecha de registro. |

### `GET /api/citas`

Lista citas con datos relacionados de cliente, usuario y servicio. Ordena por `fecha_cita DESC, hora_inicio DESC`.

Respuesta `200`:

```json
{
  "mensaje": "Citas obtenidas correctamente",
  "data": []
}
```

### `GET /api/citas/:id`

Obtiene una cita por `id_cita`.

Respuesta `404`:

```json
{
  "mensaje": "Cita no encontrada"
}
```

### `POST /api/citas`

Crea una cita.

Body:

```json
{
  "id_cliente": 1,
  "id_usuario": 1,
  "id_servicio": 1,
  "fecha_cita": "2026-05-27",
  "hora_inicio": "09:00:00",
  "hora_fin": "10:00:00",
  "estado": "PENDIENTE",
  "observaciones": "Primera visita"
}
```

Campos requeridos: `id_cliente`, `id_usuario`, `id_servicio`, `fecha_cita`, `hora_inicio`, `hora_fin`.

Campos opcionales: `estado`, `observaciones`.

Respuesta `201`:

```json
{
  "mensaje": "Cita creada correctamente",
  "data": {}
}
```

Respuesta `400`:

```json
{
  "mensaje": "Datos incompletos. Cliente, usuario, servicio, fecha, hora_inicio y hora_fin son obligatorios"
}
```

### `PUT /api/citas/:id`

Actualiza una cita. Los campos son opcionales.

Body:

```json
{
  "id_cliente": 1,
  "id_usuario": 2,
  "id_servicio": 1,
  "fecha_cita": "2026-05-28",
  "hora_inicio": "10:00:00",
  "hora_fin": "11:00:00",
  "estado": "CONFIRMADA",
  "observaciones": "Reprogramada"
}
```

Respuesta `200`:

```json
{
  "mensaje": "Cita actualizada correctamente",
  "data": {}
}
```

### `DELETE /api/citas/:id`

Elimina una cita.

Respuesta `200`:

```json
{
  "mensaje": "Cita eliminada correctamente",
  "data": {}
}
```

## Ingresos

Base path: `/api/ingresos`

Requiere `Authorization: Bearer <token>`.

### Campos del recurso

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| `id_ingreso` | number | Identificador del ingreso. |
| `tipo_ingreso` | string | Tipo de ingreso. |
| `concepto` | string | Concepto del ingreso. |
| `monto` | number | Monto. |
| `metodo_pago` | string | Metodo de pago. |
| `fecha_ingreso` | date/datetime/string | Fecha del ingreso. Por defecto fecha actual. |
| `id_cliente` | number/null | Cliente relacionado. |
| `cliente` | string/null | Nombre completo del cliente en listados. |
| `id_usuario` | number/null | Usuario relacionado. |
| `usuario` | string/null | Nombre completo del usuario en listados. |
| `observaciones` | string/null | Observaciones. |

### `GET /api/ingresos`

Lista ingresos con cliente y usuario relacionados cuando existen. Ordena por `fecha_ingreso DESC`.

Respuesta `200`:

```json
{
  "mensaje": "Ingresos obtenidos correctamente",
  "data": []
}
```

### `GET /api/ingresos/:id`

Obtiene un ingreso por `id_ingreso`.

Respuesta `404`:

```json
{
  "mensaje": "Ingreso no encontrado"
}
```

### `POST /api/ingresos`

Crea un ingreso.

Body:

```json
{
  "tipo_ingreso": "SERVICIO",
  "concepto": "Corte de cabello",
  "monto": 75.0,
  "metodo_pago": "EFECTIVO",
  "fecha_ingreso": "2026-05-27",
  "id_cliente": 1,
  "id_usuario": 1,
  "observaciones": "Pago completo"
}
```

Campos requeridos: `tipo_ingreso`, `concepto`, `monto`, `metodo_pago`.

Campos opcionales: `fecha_ingreso`, `id_cliente`, `id_usuario`, `observaciones`.

Respuesta `201`:

```json
{
  "mensaje": "Ingreso creado correctamente",
  "data": {}
}
```

Respuesta `400`:

```json
{
  "mensaje": "tipo_ingreso, concepto, monto y metodo_pago son obligatorios"
}
```

### `PUT /api/ingresos/:id`

Actualiza un ingreso. Los campos son opcionales.

Body:

```json
{
  "tipo_ingreso": "PRODUCTO",
  "concepto": "Venta de shampoo",
  "monto": 120.0,
  "metodo_pago": "TARJETA",
  "fecha_ingreso": "2026-05-27",
  "id_cliente": 1,
  "id_usuario": 1,
  "observaciones": "Venta mostrador"
}
```

Respuesta `200`:

```json
{
  "mensaje": "Ingreso actualizado correctamente",
  "data": {}
}
```

### `DELETE /api/ingresos/:id`

Elimina un ingreso.

Respuesta `200`:

```json
{
  "mensaje": "Ingreso eliminado correctamente",
  "data": {}
}
```

## Gastos

Base path: `/api/gastos`

Requiere `Authorization: Bearer <token>`.

### Campos del recurso

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| `id_gasto` | number | Identificador del gasto. |
| `categoria` | string | Categoria del gasto. |
| `concepto` | string | Concepto del gasto. |
| `monto` | number | Monto. |
| `metodo_pago` | string | Metodo de pago. |
| `fecha_gasto` | date/datetime/string | Fecha del gasto. Por defecto fecha actual. |
| `id_usuario` | number/null | Usuario relacionado. |
| `usuario` | string/null | Nombre completo del usuario en listados. |
| `observaciones` | string/null | Observaciones. |

### `GET /api/gastos`

Lista gastos con usuario relacionado cuando existe. Ordena por `fecha_gasto DESC`.

Respuesta `200`:

```json
{
  "mensaje": "Gastos obtenidos correctamente",
  "data": []
}
```

### `GET /api/gastos/:id`

Obtiene un gasto por `id_gasto`.

Respuesta `404`:

```json
{
  "mensaje": "Gasto no encontrado"
}
```

### `POST /api/gastos`

Crea un gasto.

Body:

```json
{
  "categoria": "INSUMOS",
  "concepto": "Compra de tintes",
  "monto": 300.0,
  "metodo_pago": "EFECTIVO",
  "fecha_gasto": "2026-05-27",
  "id_usuario": 1,
  "observaciones": "Proveedor local"
}
```

Campos requeridos: `categoria`, `concepto`, `monto`, `metodo_pago`.

Campos opcionales: `fecha_gasto`, `id_usuario`, `observaciones`.

Respuesta `201`:

```json
{
  "mensaje": "Gasto creado correctamente",
  "data": {}
}
```

Respuesta `400`:

```json
{
  "mensaje": "categoria, concepto, monto y metodo_pago son obligatorios"
}
```

### `PUT /api/gastos/:id`

Actualiza un gasto. Los campos son opcionales.

Body:

```json
{
  "categoria": "RENTA",
  "concepto": "Pago de local",
  "monto": 2500.0,
  "metodo_pago": "TRANSFERENCIA",
  "fecha_gasto": "2026-05-27",
  "id_usuario": 1,
  "observaciones": "Pago mensual"
}
```

Respuesta `200`:

```json
{
  "mensaje": "Gasto actualizado correctamente",
  "data": {}
}
```

### `DELETE /api/gastos/:id`

Elimina un gasto.

Respuesta `200`:

```json
{
  "mensaje": "Gasto eliminado correctamente",
  "data": {}
}
```

## Resumen de rutas

| Metodo | Ruta | Protegida | Descripcion |
| --- | --- | --- | --- |
| `GET` | `/` | No | Estado de la API. |
| `GET` | `/api/test-db` | No | Prueba de conexion a MySQL. |
| `POST` | `/api/auth/login` | No | Inicio de sesion. |
| `GET` | `/api/usuarios` | Si | Listar usuarios. |
| `GET` | `/api/usuarios/:id` | Si | Obtener usuario. |
| `POST` | `/api/usuarios` | Si | Crear usuario. |
| `PUT` | `/api/usuarios/:id` | Si | Actualizar usuario. |
| `DELETE` | `/api/usuarios/:id` | Si | Eliminar usuario. |
| `GET` | `/api/clientes` | Si | Listar clientes. |
| `GET` | `/api/clientes/:id` | Si | Obtener cliente. |
| `POST` | `/api/clientes` | Si | Crear cliente. |
| `PUT` | `/api/clientes/:id` | Si | Actualizar cliente. |
| `DELETE` | `/api/clientes/:id` | Si | Eliminar cliente. |
| `GET` | `/api/servicios` | Si | Listar servicios. |
| `GET` | `/api/servicios/:id` | Si | Obtener servicio. |
| `POST` | `/api/servicios` | Si | Crear servicio. |
| `PUT` | `/api/servicios/:id` | Si | Actualizar servicio. |
| `DELETE` | `/api/servicios/:id` | Si | Eliminar servicio. |
| `GET` | `/api/productos` | Si | Listar productos. |
| `GET` | `/api/productos/:id` | Si | Obtener producto. |
| `POST` | `/api/productos` | Si | Crear producto. |
| `PUT` | `/api/productos/:id` | Si | Actualizar producto. |
| `DELETE` | `/api/productos/:id` | Si | Eliminar producto. |
| `GET` | `/api/citas` | Si | Listar citas. |
| `GET` | `/api/citas/:id` | Si | Obtener cita. |
| `POST` | `/api/citas` | Si | Crear cita. |
| `PUT` | `/api/citas/:id` | Si | Actualizar cita. |
| `DELETE` | `/api/citas/:id` | Si | Eliminar cita. |
| `GET` | `/api/ingresos` | Si | Listar ingresos. |
| `GET` | `/api/ingresos/:id` | Si | Obtener ingreso. |
| `POST` | `/api/ingresos` | Si | Crear ingreso. |
| `PUT` | `/api/ingresos/:id` | Si | Actualizar ingreso. |
| `DELETE` | `/api/ingresos/:id` | Si | Eliminar ingreso. |
| `GET` | `/api/gastos` | Si | Listar gastos. |
| `GET` | `/api/gastos/:id` | Si | Obtener gasto. |
| `POST` | `/api/gastos` | Si | Crear gasto. |
| `PUT` | `/api/gastos/:id` | Si | Actualizar gasto. |
| `DELETE` | `/api/gastos/:id` | Si | Eliminar gasto. |

## Codigos de estado usados

| Codigo | Significado |
| --- | --- |
| `200` | Consulta, actualizacion o eliminacion correcta. |
| `201` | Recurso creado correctamente. |
| `400` | Datos requeridos incompletos. |
| `401` | Token faltante, invalido o expirado. |
| `404` | Recurso no encontrado o id invalido. |
| `500` | Error interno o error de base de datos. |
