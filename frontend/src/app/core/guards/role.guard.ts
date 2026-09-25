import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { Rol } from '../models/models';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  const allowedRoles = route.data?.['roles'] as Rol[] | undefined;
  const currentRole = authService.userRole();

  if (!allowedRoles || (currentRole && allowedRoles.includes(currentRole))) {
    return true;
  }

  notificationService.error('Tu rol actual no tiene acceso a esta sección.', 'Acceso denegado');
  router.navigate(['/dashboard']);
  return false;
};
