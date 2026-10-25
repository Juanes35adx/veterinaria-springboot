import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ClienteService } from './cliente.service';
import { Cliente } from '../../models/models';

describe('ClienteService', () => {
  let servicio: ClienteService;
  let http: HttpTestingController;

  const camila: Cliente = { id: 1, nombre: 'Camila Restrepo', telefono: '3001234567', email: 'camila@mail.com' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    servicio = TestBed.inject(ClienteService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('lista los clientes', () => {
    let resultado: Cliente[] = [];
    servicio.listarTodos().subscribe(clientes => (resultado = clientes));

    const peticion = http.expectOne('/api/clientes');
    expect(peticion.request.method).toBe('GET');
    peticion.flush([camila]);

    expect(resultado).toEqual([camila]);
  });

  it('obtiene un cliente por id', () => {
    let resultado: Cliente | undefined;
    servicio.obtenerPorId(1).subscribe(cliente => (resultado = cliente));

    const peticion = http.expectOne('/api/clientes/1');
    expect(peticion.request.method).toBe('GET');
    peticion.flush(camila);

    expect(resultado).toEqual(camila);
  });

  it('crea un cliente', () => {
    const nuevo: Cliente = { nombre: 'Ana Rios', telefono: '3110000000', email: 'ana@mail.com' };
    let resultado: Cliente | undefined;
    servicio.crear(nuevo).subscribe(cliente => (resultado = cliente));

    const peticion = http.expectOne('/api/clientes');
    expect(peticion.request.method).toBe('POST');
    expect(peticion.request.body).toEqual(nuevo);
    peticion.flush({ ...nuevo, id: 2 }, { status: 201, statusText: 'Created' });

    expect(resultado?.id).toBe(2);
  });

  it('actualiza un cliente', () => {
    const editado: Cliente = { ...camila, telefono: '3009999999' };
    let resultado: Cliente | undefined;
    servicio.actualizar(1, editado).subscribe(cliente => (resultado = cliente));

    const peticion = http.expectOne('/api/clientes/1');
    expect(peticion.request.method).toBe('PUT');
    expect(peticion.request.body).toEqual(editado);
    peticion.flush(editado);

    expect(resultado?.telefono).toBe('3009999999');
  });

  it('elimina un cliente', () => {
    let completado = false;
    servicio.eliminar(1).subscribe({ complete: () => (completado = true) });

    const peticion = http.expectOne('/api/clientes/1');
    expect(peticion.request.method).toBe('DELETE');
    peticion.flush(null, { status: 204, statusText: 'No Content' });

    expect(completado).toBe(true);
  });
});
