package com.eltonsantos.backend.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "Dados para atualização do perfil do usuário")
public class UpdateProfileRequest {
    
    @Schema(description = "Nome completo do usuário", example = "João Silva Santos", requiredMode = Schema.RequiredMode.REQUIRED, minLength = 2, maxLength = 100)
    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 2, max = 100, message = "Nome deve ter entre 2 e 100 caracteres")
    private String fullName;
}
