package com.eltonsantos.backend.dto.request;

import jakarta.validation.constraints.Size;

public record VacationDecisionRequest(
        @Size(max = 500, message = "Comment must be at most 500 characters")
        String comment
) {}
