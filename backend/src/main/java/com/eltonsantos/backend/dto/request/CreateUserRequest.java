package com.eltonsantos.backend.dto.request;

import com.eltonsantos.backend.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.UUID;

@Data
public class CreateUserRequest {
    
    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    private String email;
    
    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 8, message = "Senha deve ter pelo menos 8 caracteres")
    private String password;
    
    @NotNull(message = "Role é obrigatória")
    private Role role;
    
    @NotBlank(message = "Nome é obrigatório")
    private String fullName;
    
    // Required for COLLABORATOR role - the manager who will manage this user
    private UUID managerId;
}
