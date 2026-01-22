package com.eltonsantos.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class VacationOverlapException extends BusinessException {

    public VacationOverlapException(String message) {
        super(message);
    }

    public VacationOverlapException() {
        super("The requested vacation period overlaps with an existing PENDING or APPROVED vacation request.");
    }
}
