package com.eltonsantos.backend.dto.request;

import com.eltonsantos.backend.enums.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "Dados para atualização de usuário existente")
public class UpdateUserRequest {
    
    @Schema(description = "Email do usuário", example = "maria.santos@empresa.com", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    private String email;
    
    @Schema(description = "Nova senha (opcional - apenas atualiza se fornecida)", example = "NovaSenha@123", minLength = 8)
    @Size(min = 8, message = "Senha deve ter pelo menos 8 caracteres")
    private String password;
    
    @Schema(description = "Papel do usuário no sistema", example = "MANAGER", requiredMode = Schema.RequiredMode.REQUIRED, allowableValues = {"ADMIN", "MANAGER", "COLLABORATOR"})
    @NotNull(message = "Role é obrigatória")
    private Role role;
}
