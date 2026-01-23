package com.eltonsantos.backend.dto.response;

import com.eltonsantos.backend.enums.Role;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.UUID;

@Schema(description = "Resposta de autenticação contendo token JWT e dados do usuário")
public record AuthResponse(
        @Schema(description = "Token JWT para autenticação", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
        String token,

        @Schema(description = "Tipo do token", example = "Bearer", defaultValue = "Bearer")
        String type,

        @Schema(description = "ID único do usuário", example = "550e8400-e29b-41d4-a716-446655440000")
        UUID userId,

        @Schema(description = "Email do usuário autenticado", example = "admin@vacation.com")
        String email,

        @Schema(description = "Papel do usuário no sistema", example = "ADMIN")
        Role role
) {
    public AuthResponse(String token, UUID userId, String email, Role role) {
        this(token, "Bearer", userId, email, role);
    }
}
