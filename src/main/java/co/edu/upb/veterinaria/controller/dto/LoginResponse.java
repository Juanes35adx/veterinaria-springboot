package co.edu.upb.veterinaria.controller.dto;

/**
 * Respuesta de un inicio de sesion exitoso: el token que el cliente debe
 * enviar luego en la cabecera "Authorization: Bearer <token>".
 */
public record LoginResponse(String token, String username, String rol, String nombreCompleto, long expiraEnMs) {
}
