package com.eltonsantos.backend.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "Dados para alteração de senha do usuário")
public class ChangePasswordRequest {
    
    @Schema(description = "Senha atual do usuário", example = "SenhaAtual@123", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "Senha atual é obrigatória")
    private String currentPassword;
    
    @Schema(description = "Nova senha desejada", example = "NovaSenha@456", requiredMode = Schema.RequiredMode.REQUIRED, minLength = 8)
    @NotBlank(message = "Nova senha é obrigatória")
    @Size(min = 8, message = "Nova senha deve ter pelo menos 8 caracteres")
    private String newPassword;
}
