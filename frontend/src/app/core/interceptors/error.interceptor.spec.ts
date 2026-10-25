import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { errorInterceptor } from './error.interceptor';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let backend: HttpTestingController;
  const auth = { logout: vi.fn() };
  const avisos = { error: vi.fn(), warning: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: auth },
        { provide: NotificationService, useValue: avisos }
      ]
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
  });

  afterEach(() => backend.verify());

  it('ante un 401 avisa al usuario y cierra la sesion', () => {
    http.get('/api/clientes').subscribe({ error: () => {} });

    backend.expectOne('/api/clientes').flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(avisos.warning).toHaveBeenCalled();
    expect(auth.logout).toHaveBeenCalled();
  });

  it('ante credenciales invalidas muestra el error sin cerrar sesion', () => {
    http.post('/api/auth/login', {}).subscribe({ error: () => {} });

    backend.expectOne('/api/auth/login').flush(
      { message: 'Usuario o contrasena incorrectos' },
      { status: 401, statusText: 'Unauthorized' }
    );

    expect(avisos.error).toHaveBeenCalledWith('Usuario o contrasena incorrectos', 'Acceso denegado');
    expect(auth.logout).not.toHaveBeenCalled();
  });
});
