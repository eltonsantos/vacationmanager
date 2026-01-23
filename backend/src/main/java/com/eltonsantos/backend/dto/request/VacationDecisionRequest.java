package com.eltonsantos.backend.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;

@Schema(description = "Dados para aprovação ou rejeição de solicitação de férias")
public record VacationDecisionRequest(
        @Schema(description = "Comentário do gestor sobre a decisão", example = "Aprovado conforme solicitado", maxLength = 500)
        @Size(max = 500, message = "Comment must be at most 500 characters")
        String comment
) {}
