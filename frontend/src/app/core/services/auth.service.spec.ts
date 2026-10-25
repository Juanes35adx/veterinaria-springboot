import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { LoginResponse } from '../models/models';

const STORAGE_KEY = 'protozoo_auth_session';

const respuestaLogin: LoginResponse = {
  token: 'token-de-prueba',
  username: 'admin',
  rol: 'ADMIN',
  nombreCompleto: 'Administrador del sistema',
  expiraEnMs: 28800000
};

/**
 * localStorage en memoria. Node 25+ define su propio localStorage global, que
 * queda indefinido sin --localstorage-file y tapa el de jsdom.
 */
class AlmacenEnMemoria implements Storage {
  private datos = new Map<string, string>();
  get length() { return this.datos.size; }
  clear() { this.datos.clear(); }
  getItem(clave: string) { return this.datos.get(clave) ?? null; }
  key(indice: number) { return [...this.datos.keys()][indice] ?? null; }
  removeItem(clave: string) { this.datos.delete(clave); }
  setItem(clave: string, valor: string) { this.datos.set(clave, String(valor)); }
}

describe('AuthService', () => {
  let http: HttpTestingController;
  const router = { navigate: vi.fn() };

  beforeEach(() => {
    vi.stubGlobal('localStorage', new AlmacenEnMemoria());
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: router }
      ]
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    vi.unstubAllGlobals();
  });

  it('inicia sesion contra la API y guarda la sesion', () => {
    const servicio = TestBed.inject(AuthService);

    servicio.login({ username: 'admin', password: 'admin123' }).subscribe();

    const peticion = http.expectOne('/api/auth/login');
    expect(peticion.request.method).toBe('POST');
    expect(peticion.request.body).toEqual({ username: 'admin', password: 'admin123' });
    peticion.flush(respuestaLogin);

    expect(servicio.isLoggedIn()).toBe(true);
    expect(servicio.getToken()).toBe('token-de-prueba');
    expect(servicio.isAdmin()).toBe(true);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual(respuestaLogin);
  });

  it('conserva la sesion al recargar la pagina', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(respuestaLogin));

    const servicio = TestBed.inject(AuthService);

    expect(servicio.isLoggedIn()).toBe(true);
    expect(servicio.getToken()).toBe('token-de-prueba');
    expect(servicio.userName()).toBe('Administrador del sistema');
  });

  it('no queda autenticado si el login falla', () => {
    const servicio = TestBed.inject(AuthService);

    servicio.login({ username: 'admin', password: 'mala' }).subscribe({ error: () => {} });
    http.expectOne('/api/auth/login').flush(
      { message: 'Usuario o contrasena incorrectos' },
      { status: 401, statusText: 'Unauthorized' }
    );

    expect(servicio.isLoggedIn()).toBe(false);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('cierra sesion eliminando el token y vuelve al login', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(respuestaLogin));
    const servicio = TestBed.inject(AuthService);

    servicio.logout();

    expect(servicio.getToken()).toBeNull();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('ignora una sesion guardada corrupta', () => {
    localStorage.setItem(STORAGE_KEY, '{no-es-json');

    expect(TestBed.inject(AuthService).isLoggedIn()).toBe(false);
  });

  it('calcula los permisos segun el rol', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...respuestaLogin, rol: 'RECEPCIONISTA' }));
    const servicio = TestBed.inject(AuthService);

    expect(servicio.isRecepcionista()).toBe(true);
    expect(servicio.canManageClinic()).toBe(false);
    expect(servicio.canDelete()).toBe(false);
  });
});
