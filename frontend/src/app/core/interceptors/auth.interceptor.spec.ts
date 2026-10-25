import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';

describe('authInterceptor', () => {
  let http: HttpClient;
  let backend: HttpTestingController;
  let token: string | null;

  beforeEach(() => {
    token = null;
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: { getToken: () => token } }
      ]
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
  });

  afterEach(() => backend.verify());

  it('adjunta el token como Bearer cuando hay sesion', () => {
    token = 'abc.def.ghi';

    http.get('/api/clientes').subscribe();

    const peticion = backend.expectOne('/api/clientes');
    expect(peticion.request.headers.get('Authorization')).toBe('Bearer abc.def.ghi');
    peticion.flush([]);
  });

  it('no agrega la cabecera si no hay sesion', () => {
    http.get('/api/clientes').subscribe();

    const peticion = backend.expectOne('/api/clientes');
    expect(peticion.request.headers.has('Authorization')).toBe(false);
    peticion.flush([]);
  });

  it('no envia el token en la peticion de login', () => {
    token = 'token-viejo';

    http.post('/api/auth/login', { username: 'admin', password: 'admin123' }).subscribe();

    const peticion = backend.expectOne('/api/auth/login');
    expect(peticion.request.headers.has('Authorization')).toBe(false);
    peticion.flush({});
  });
});
