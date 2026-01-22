package com.eltonsantos.backend.dto.request;

import com.eltonsantos.backend.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateUserRequest {
    
    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    private String email;
    
    @Size(min = 8, message = "Senha deve ter pelo menos 8 caracteres")
    private String password; // Optional - only update if provided
    
    @NotNull(message = "Role é obrigatória")
    private Role role;
}
