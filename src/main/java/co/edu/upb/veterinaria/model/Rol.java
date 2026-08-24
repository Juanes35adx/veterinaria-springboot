package co.edu.upb.veterinaria.model;

/**
 * Roles disponibles en el sistema. Determinan que endpoints puede usar
 * cada usuario autenticado (ver SecurityConfig).
 */
public enum Rol {

	/** Acceso total, incluido eliminar registros y gestionar veterinarios. */
	ADMIN,

	/** Atiende pacientes: consultas, diagnosticos y prescripciones. */
	VETERINARIO,

	/** Atiende el mostrador: clientes y mascotas. */
	RECEPCIONISTA

}
