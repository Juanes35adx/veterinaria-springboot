# Veterinaria API

API REST para la gestión de clientes y sus mascotas, construida con Spring
Boot como proyecto del curso de Plataformas.

## Stack

| Componente | Version |
|---|---|
| Java | 25 |
| Spring Boot | 4.1.0 |
| Build | Maven (wrapper incluido) |
| Base de datos | PostgreSQL 18 (local, administrada con pgAdmin 4) |
| ORM | Spring Data JPA / Hibernate |
| Tests | H2 en memoria (aislado de la base real) |

## Arquitectura de capas

```
co.edu.upb.veterinaria
├── VeterinariaApplication.java   @SpringBootApplication
├── model
│   ├── Cliente.java               @Entity
│   └── Mascota.java               @Entity (@ManyToOne hacia Cliente)
├── repository
│   ├── ClienteRepository.java     @Repository
│   └── MascotaRepository.java     @Repository (+ findByClienteId)
├── service
│   ├── ClienteService.java        @Service (validaciones)
│   └── MascotaService.java        @Service (validaciones + resuelve el Cliente real)
├── controller
│   ├── ClienteController.java     @RestController
│   ├── MascotaController.java     @RestController
│   └── ManejadorGlobalDeErrores.java   @RestControllerAdvice
└── exception
    └── RecursoNoEncontradoException.java
```

Flujo de una petición: `Controller -> Service -> Repository -> PostgreSQL`.

## Modelo de datos

**Cliente** (el dueño):

| Campo | Tipo |
|---|---|
| `id` | `Long` (autoincremental) |
| `nombre` | `String` |
| `telefono` | `String` |
| `email` | `String` |

**Mascota**, asociada a un `Cliente` vía `@ManyToOne` (relación
unidireccional: la mascota conoce a su dueño, el dueño no carga la lista de
sus mascotas — evita problemas de serialización JSON cíclica):

| Campo | Tipo |
|---|---|
| `id` | `Long` (autoincremental) |
| `nombre` | `String` |
| `especie` | `String` |
| `raza` | `String` |
| `edad` | `int` |
| `cliente` | `Cliente` (FK `cliente_id`, con restricción de llave foránea real en Postgres) |

## Validaciones

En `ClienteService`:
- `nombre` y `telefono` no pueden estar vacíos.

En `MascotaService`:
- `nombre` no puede estar vacío.
- `edad` no puede ser negativa.
- El `cliente` debe existir en la base de datos — si el id no corresponde a
  ningún cliente real, se rechaza con `404`, no con un guardado silencioso.

Ambos servicios lanzan `IllegalArgumentException` (→ `400`) para datos
inválidos, y `RecursoNoEncontradoException` (→ `404`) cuando se pide,
actualiza o borra un id que no existe.

## Endpoints

### Clientes — `/api/clientes`

| Método | Ruta | Descripción | Respuesta |
|---|---|---|---|
| `POST` | `/api/clientes` | Crear cliente | `201 CREATED` |
| `GET` | `/api/clientes` | Listar todos | `200 OK` |
| `GET` | `/api/clientes/{id}` | Obtener uno | `200 OK` / `404` |
| `PUT` | `/api/clientes/{id}` | Actualizar | `200 OK` / `404` |
| `DELETE` | `/api/clientes/{id}` | Eliminar | `204 NO CONTENT` / `404` |

### Mascotas — `/api/mascotas`

| Método | Ruta | Descripción | Respuesta |
|---|---|---|---|
| `POST` | `/api/mascotas` | Crear mascota | `201 CREATED` / `404` si el cliente no existe |
| `GET` | `/api/mascotas` | Listar todas | `200 OK` |
| `GET` | `/api/mascotas/{id}` | Obtener una | `200 OK` / `404` |
| `GET` | `/api/mascotas/cliente/{clienteId}` | Mascotas de un dueño | `200 OK` / `404` |
| `PUT` | `/api/mascotas/{id}` | Actualizar | `200 OK` / `404` |
| `DELETE` | `/api/mascotas/{id}` | Eliminar | `204 NO CONTENT` / `404` |

## Ejemplos con cURL

Crear un cliente:

```bash
curl -i -X POST http://localhost:8080/api/clientes -H "Content-Type: application/json" -d "{\"nombre\":\"Camila Restrepo\",\"telefono\":\"3001234567\",\"email\":\"camila@mail.com\"}"
```

Crear una mascota asociada al cliente con id `1`:

```bash
curl -i -X POST http://localhost:8080/api/mascotas -H "Content-Type: application/json" -d "{\"nombre\":\"Firulais\",\"especie\":\"Perro\",\"raza\":\"Labrador\",\"edad\":3,\"cliente\":{\"id\":1}}"
```

Listar las mascotas de ese cliente:

```bash
curl -i http://localhost:8080/api/mascotas/cliente/1
```

## Base de datos

La app se conecta a PostgreSQL local (`application.yaml`):

| Campo | Valor |
|---|---|
| Host | `localhost:5432` |
| Base de datos | `VeterinariaS` |
| Usuario | `postgres` |

La contraseña se lee de la variable de entorno `DB_PASSWORD`, con un valor
por defecto local en el propio archivo — ajústala a tu instalación de
PostgreSQL antes de correr el proyecto.

Los tests **no** usan esta base — corren contra H2 en memoria
(`src/test/resources/application.yaml`), así que `mvnw test` no requiere
tener Postgres corriendo ni deja datos de prueba en `VeterinariaS`.

## Cómo ejecutar

Requiere JDK 25 y PostgreSQL corriendo localmente con la base `VeterinariaS`
creada. No hace falta instalar Maven, el wrapper viene incluido.

```bash
./mvnw spring-boot:run
```

En Windows:

```bash
mvnw.cmd spring-boot:run
```

La aplicación queda en `http://localhost:8080`.

## Tests

```bash
./mvnw test
```
