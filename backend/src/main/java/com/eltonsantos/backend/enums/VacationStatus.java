package com.eltonsantos.backend.enums;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Status da solicitação de férias", enumAsRef = true)
public enum VacationStatus {
    @Schema(description = "Aguardando aprovação do gestor")
    PENDING,
    
    @Schema(description = "Solicitação aprovada")
    APPROVED,
    
    @Schema(description = "Solicitação rejeitada pelo gestor")
    REJECTED,
    
    @Schema(description = "Solicitação cancelada pelo colaborador")
    CANCELLED
}
