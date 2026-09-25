# Protozoo · Frontend Angular

Frontend moderno para el sistema de gestión de clínica veterinaria y farmacia, conectado al backend `veterinaria-springboot` a través de API REST y autenticación JWT con roles.

---

## ?? Tecnologías

* **Framework:** Angular 22 (Standalone Components & Signals)
* **Lenguaje:** TypeScript 6
* **Estilos:** Vanilla CSS con Sistema de Diseño Clínico Moderno
* **Autenticación:** JWT con interceptor HTTP y Guards de roles
* **Servidor Dev:** Angular Dev Server con Proxy integrado hacia `http://localhost:8080`

---

## ?? Requisitos Previos

1. **Backend en ejecución:**
   Tener corriendo el backend `veterinaria-springboot` en el puerto `8080`:
   ```cmd
   cd ..\veterinaria-springboot
   mvnw.cmd spring-boot:run
   ```
2. **Node.js:** v18+ o v24+ (LTS).

---

## ?? Cómo Ejecutar el Frontend

1. Desde esta carpeta (`veterinaria-frontend`), inicia el servidor de desarrollo:
   ```cmd
   npm start
   ```
   *(o `npm run watch` / `npx ng serve`)*

2. Abre en tu navegador:
   ?? **http://localhost:4200**

---

## ?? Cuentas de Acceso (Demo)

El formulario de Login cuenta con **botones de acceso rápido de un clic** para rellenar automáticamente las credenciales:

| Rol | Usuario | Contraseña | Permisos Principales |
|---|---|---|---|
| **ADMIN** | `admin` | `admin123` | Control total, gestión de usuarios, veterinarios, farmacia, clínica y eliminación |
| **VETERINARIO** | `veterinario` | `vet123` | Área clínica (consultas, diagnósticos, emitir recetas con descuento de stock) |
| **RECEPCIONISTA** | `recepcion` | `recep123` | Área de mostrador (clientes, mascotas, catálogo de farmacia) |

---

## ? Módulos y Funcionalidades

1. **Dashboard:**
   - Métricas en tiempo real (total clientes, pacientes, consultas realizadas).
   - Semáforo y alertas automáticas de insumos farmacéuticos con stock bajo o agotado.
   - Listado de consultas recientes y accesos rápidos.

2. **Clientes & Propietarios:**
   - Registro, edición y búsqueda reactiva de clientes.
   - Explorador de mascotas asociadas a cada cliente.
   - Protección de integridad referencial.

3. **Pacientes / Mascotas:**
   - Registro con selección de cliente y filtros por especie (?? Perros, ?? Gatos, ?? Otros).
   - Acceso directo al historial clínico del paciente.

4. **Área Clínica (Consultas, Diagnósticos y Recetas):**
   - Registro de consultas médicas con toma de signos vitales (peso, temperatura) y motivo.
   - Expediente clínico interactivo:
     - Registro y listado de diagnósticos por nivel de gravedad (Leve, Moderada, Grave, Crítica).
     - Emisión de recetas médicas farmacéuticas con **descuento automático de stock** en base de datos.
     - Cancelación de recetas con **reintegro automático de stock**.

5. **Farmacia e Inventario:**
   - Catálogo de medicamentos con precios en pesos ($ COP).
   - Semáforo de stock (Disponible, Stock Bajo, Agotado).
   - Formulario de alta y actualización de insumos.

6. **Equipo Médico Veterinario:**
   - Directorio de médicos con especialidad, tarjeta profesional y datos de contacto.

7. **Administración de Usuarios:**
   - Módulo exclusivo para administradores para dar de alta cuentas asignando roles (`ADMIN`, `VETERINARIO`, `RECEPCIONISTA`).
