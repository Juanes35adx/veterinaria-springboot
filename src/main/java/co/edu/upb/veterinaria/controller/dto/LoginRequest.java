package co.edu.upb.veterinaria.controller.dto;

/**
 * Datos que envia el cliente para iniciar sesion.
 */
public record LoginRequest(String username, String password) {
}
