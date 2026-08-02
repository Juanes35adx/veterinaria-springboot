# Inventario de Farmacia API

API REST para gestionar el inventario de medicamentos de la farmacia **"Salud y Vida"**.

Taller Individual — Plataformas, UPB.

## Stack

| Componente | Version |
|---|---|
| Java | 25 |
| Spring Boot | 4.1.0 |
| Build | Maven (wrapper incluido) |
| Base de datos | H2 en memoria |
| ORM | Spring Data JPA / Hibernate |

## Arquitectura de capas

```
co.edu.upb.farmacia
├── FarmaciaInventarioApplication.java   @SpringBootApplication
├── model
│   └── Medicamento.java                 @Entity
├── repository
│   └── MedicamentoRepository.java       @Repository (extends JpaRepository)
├── service
│   └── MedicamentoService.java          @Service (reglas de negocio)
└── controller
    ├── MedicamentoController.java       @RestController
    └── ManejadorGlobalDeErrores.java    @RestControllerAdvice
```

El flujo de una peticion es `Controller -> Service -> Repository -> H2`. El
controlador no conoce el repositorio, y las validaciones viven unicamente en el
servicio.

## Como ejecutar

Requiere JDK 25 instalado. No hace falta tener Maven: el proyecto trae el wrapper.

```bash
./mvnw spring-boot:run
```

En Windows:

```bash
mvnw.cmd spring-boot:run
```

La aplicacion queda en `http://localhost:8080`.

## Modelo de datos

| Campo | Tipo | Descripcion |
|---|---|---|
| `id` | `Long` | Identificador autoincremental (`GenerationType.IDENTITY`) |
| `nombre` | `String` | Nombre del medicamento |
| `precio` | `double` | Precio de venta |
| `cantidadInventario` | `int` | Unidades disponibles |

## Validaciones

Se aplican en `MedicamentoService.guardar(...)` antes de persistir:

- `precio <= 0` lanza `IllegalArgumentException`.
- `cantidadInventario < 0` lanza `IllegalArgumentException`.

`ManejadorGlobalDeErrores` traduce esa excepcion a una respuesta **400 Bad
Request** con el mensaje de error, en lugar de un 500.

## Endpoints

Ruta base: `/api/medicamentos`

### Crear un medicamento

```
POST /api/medicamentos
Content-Type: application/json
```

```json
{ "nombre": "Paracetamol", "precio": 15.5, "cantidadInventario": 100 }
```

Respuesta **201 CREATED**:

```json
{ "id": 1, "nombre": "Paracetamol", "precio": 15.5, "cantidadInventario": 100 }
```

### Listar todos los medicamentos

```
GET /api/medicamentos
```

Respuesta **200 OK**:

```json
[
  { "id": 1, "nombre": "Paracetamol", "precio": 15.5, "cantidadInventario": 100 }
]
```

## Pruebas con cURL

Crear un medicamento:

```bash
curl -i -X POST http://localhost:8080/api/medicamentos -H "Content-Type: application/json" -d "{\"nombre\":\"Paracetamol\",\"precio\":15.5,\"cantidadInventario\":100}"
```

Listar los medicamentos:

```bash
curl -i http://localhost:8080/api/medicamentos
```

Precio invalido (devuelve 400):

```bash
curl -i -X POST http://localhost:8080/api/medicamentos -H "Content-Type: application/json" -d "{\"nombre\":\"Aspirina\",\"precio\":0,\"cantidadInventario\":10}"
```

Cantidad negativa (devuelve 400):

```bash
curl -i -X POST http://localhost:8080/api/medicamentos -H "Content-Type: application/json" -d "{\"nombre\":\"Ibuprofeno\",\"precio\":8.75,\"cantidadInventario\":-5}"
```

## Consola de H2

Con la aplicacion corriendo: `http://localhost:8080/h2-console`

| Campo | Valor |
|---|---|
| JDBC URL | `jdbc:h2:mem:farmaciadb` |
| Usuario | `sa` |
| Contrasena | *(vacia)* |

Desde ahi se puede correr `SELECT * FROM MEDICAMENTO;` para comprobar la
persistencia.

## Tests

```bash
./mvnw test
```
