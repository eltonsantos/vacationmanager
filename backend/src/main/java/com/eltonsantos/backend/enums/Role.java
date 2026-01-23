package com.eltonsantos.backend.enums;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Papel/função do usuário no sistema", enumAsRef = true)
public enum Role {
    @Schema(description = "Administrador - acesso total ao sistema")
    ADMIN,
    
    @Schema(description = "Gerente - pode aprovar/rejeitar férias dos colaboradores sob sua gestão")
    MANAGER,
    
    @Schema(description = "Colaborador - pode solicitar e visualizar suas próprias férias")
    COLLABORATOR
}
