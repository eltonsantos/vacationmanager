package com.eltonsantos.backend.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Value("${server.port:8080}")
    private String serverPort;

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "bearerAuth";

        return new OpenAPI()
            .info(new Info()
                .title("VacationManager API")
                .version("1.0.0")
                .description("""
                    ## Sistema de Gestão de Férias
                    
                    API RESTful para gerenciamento completo de solicitações de férias em ambiente corporativo.
                    
                    ### Funcionalidades Principais
                    
                    - **Autenticação**: Login com JWT e gerenciamento de perfil
                    - **Colaboradores**: Cadastro e gestão de colaboradores
                    - **Férias**: Solicitação, aprovação e rejeição de férias
                    - **Saldo**: Consulta de saldo de dias de férias
                    - **Auditoria**: Logs de todas as ações do sistema
                    
                    ### Autenticação
                    
                    A API utiliza autenticação via **JWT (JSON Web Token)**. Para acessar os endpoints protegidos:
                    
                    1. Faça login em `/auth/login` com email e senha
                    2. Copie o token retornado
                    3. Clique no botão **Authorize** acima
                    4. Cole o token no campo (sem o prefixo "Bearer")
                    
                    ### Papéis de Usuário
                    
                    | Papel | Permissões |
                    |-------|------------|
                    | ADMIN | Acesso total ao sistema |
                    | MANAGER | Aprovar/rejeitar férias, visualizar colaboradores |
                    | COLLABORATOR | Solicitar férias, visualizar próprias solicitações |
                    """)
                .contact(new Contact()
                    .name("Elton Santos")
                    .email("elton@lbc.local")
                    .url("https://github.com/eltonsantos"))
                .license(new License()
                    .name("MIT License")
                    .url("https://opensource.org/licenses/MIT")))
            .externalDocs(new ExternalDocumentation()
                .description("Documentação Completa do Projeto")
                .url("https://github.com/eltonsantos/vacation-manager"))
            .servers(List.of(
                new Server()
                    .url("http://localhost:" + serverPort + "/api/v1")
                    .description("Servidor de Desenvolvimento Local"),
                new Server()
                    .url("https://api.vacationmanager.com/api/v1")
                    .description("Servidor de Produção")))
            .tags(List.of(
                new Tag().name("Autenticação").description("Endpoints para login, cadastro e gerenciamento de perfil"),
                new Tag().name("Férias").description("Endpoints para solicitação e gestão de férias"),
                new Tag().name("Colaboradores").description("Endpoints para gerenciamento de colaboradores"),
                new Tag().name("Usuários").description("Endpoints para gerenciamento de usuários (Admin)"),
                new Tag().name("Saldo de Férias").description("Endpoints para consulta de saldo de férias"),
                new Tag().name("Auditoria").description("Endpoints para consulta de logs de auditoria (Admin)")))
            .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
            .components(new Components()
                .addSecuritySchemes(securitySchemeName,
                    new SecurityScheme()
                        .name(securitySchemeName)
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")
                        .description("Token JWT obtido através do endpoint /auth/login. Insira apenas o token, sem o prefixo 'Bearer'.")));
    }
}
