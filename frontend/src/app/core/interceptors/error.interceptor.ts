import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error inesperado.';

      if (error.error && typeof error.error === 'object' && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      switch (error.status) {
        case 401:
          if (!req.url.includes('/api/auth/login')) {
            notificationService.warning('Tu sesión ha expirado o no es válida. Por favor ingresa nuevamente.', 'Sesión requerida');
            authService.logout();
          } else {
            notificationService.error(errorMessage || 'Usuario o contraseña incorrectos.', 'Acceso denegado');
          }
          break;
        case 403:
          notificationService.error(errorMessage || 'No tienes permisos suficientes para realizar esta acción.', 'Acceso restringido');
          break;
        case 404:
          notificationService.warning(errorMessage || 'El recurso solicitado no fue encontrado.', 'No encontrado');
          break;
        case 409:
          notificationService.error(errorMessage, 'Conflicto de Integridad');
          break;
        case 400:
          notificationService.warning(errorMessage, 'Datos inválidos');
          break;
        // 0: sin respuesta del servidor. 502/503/504: el proxy de desarrollo no logra
        // conectar con el backend (llega como un error HTTP, no como estado 0).
        case 0:
        case 502:
        case 503:
        case 504:
          notificationService.error('No se pudo conectar con el servidor backend. Asegúrate de que Spring Boot esté en ejecución en el puerto 8080.', 'Error de Conexión');
          break;
        default:
          notificationService.error(errorMessage, `Error (${error.status || 'Servidor'})`);
          break;
      }

      return throwError(() => error);
    })
  );
};
