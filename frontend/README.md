# Protozoo · Frontend Angular

SPA para el sistema de gestión de clínica veterinaria y farmacia. Consume la API REST del backend `veterinaria-springboot` (raíz de este repositorio) y se autentica con JWT.

## Tecnologías

- **Framework:** Angular 22 (componentes standalone)
- **Lenguaje:** TypeScript 6 en modo estricto
- **Autenticación:** JWT guardado en `localStorage`, interceptor HTTP y guards de rol
- **Desarrollo:** Angular Dev Server con proxy hacia el backend

## Requisitos previos

1. **Node.js 24.15 o superior** (o 22.22.3+ / 26+). Angular 22 no arranca con versiones anteriores. Verifica con `node -v`.
2. **Backend en ejecución** en el puerto `8080`. Desde la raíz del repositorio, con PostgreSQL encendido y la base `VeterinariaS` creada (ver el README de la raíz):
   ```cmd
   .\mvnw.cmd spring-boot:run
   ```

## Instalación y ejecución

Desde la carpeta `frontend/`:

```cmd
npm install
npm start
```

Abre **http://localhost:4200**. La primera vez `npm install` descarga las dependencias; después basta con `npm start`.

## Configurar la URL del backend

El frontend llama a rutas relativas (`/api/clientes`, `/api/auth/login`, ...) y el servidor de desarrollo las reenvía al backend según [`proxy.conf.json`](proxy.conf.json):

```json
{
  "/api": {
    "target": "http://localhost:8080"
  }
}
```

Si el backend corre en otra dirección o puerto, cambia el valor de `target` y reinicia `npm start`. Como el navegador solo habla con el puerto 4200, no hace falta configurar CORS en el backend.

## Cuentas de demostración

El backend crea estas cuentas al arrancar por primera vez:

| Rol | Usuario | Contraseña | Acceso |
|---|---|---|---|
| ADMIN | `admin` | `admin123` | Todo, incluido usuarios, veterinarios y eliminar registros |
| VETERINARIO | `veterinario` | `vet123` | Área clínica: consultas, diagnósticos y recetas |
| RECEPCIONISTA | `recepcion` | `recep123` | Clientes, mascotas y consulta de farmacia |

## Estructura del código

```
src/app/
├── core/
│   ├── models/          Interfaces de las entidades y de los cuerpos de petición
│   ├── services/api/    Un servicio por entidad: todas las llamadas HTTP viven aquí
│   ├── services/        Sesión (auth), notificaciones y tema
│   ├── interceptors/    Agrega el token a cada petición y traduce los errores del backend
│   └── guards/          authGuard (exige sesión) y roleGuard (exige rol)
├── layout/              Barra superior, menú lateral y marco de las pantallas
├── shared/components/   Modal, diálogo de confirmación y avisos reutilizables
└── modules/             Una pantalla por área: auth, dashboard, clientes, mascotas,
                         consultas, medicamentos, veterinarios y usuarios
```

Los componentes no usan `HttpClient`: siempre pasan por un servicio de `core/services/api/`.

## Flujo de autenticación

1. `login.component` llama a `AuthService.login()`, que hace `POST /api/auth/login`.
2. La respuesta (token, usuario y rol) se guarda en `localStorage`, así la sesión sobrevive a recargar la página.
3. `auth.interceptor` agrega `Authorization: Bearer <token>` a toda petición que no sea el login.
4. `error.interceptor` muestra un aviso según el código: 401 (credenciales o sesión inválidas; si la sesión expiró, cierra sesión), 403, 404, 409 o sin conexión.
5. `logout()` borra el token y redirige a `/login`.

## Funcionalidades

- **Panel:** totales de clientes, mascotas y consultas, alertas de stock bajo y consultas recientes.
- **Clientes y mascotas:** listado, alta, edición y eliminación con confirmación.
- **Consultas:** registro de consultas con signos vitales; dentro de cada expediente, diagnósticos y recetas. Al emitir una receta el backend descuenta el stock, y al cancelarla lo devuelve.
- **Farmacia:** catálogo con semáforo de stock (disponible, bajo, agotado).
- **Veterinarios y usuarios:** gestión reservada al ADMIN.

Los botones se muestran u ocultan según el rol, pero la autorización real la hace el backend: una petición sin permiso responde 403 aunque se salte la interfaz.
