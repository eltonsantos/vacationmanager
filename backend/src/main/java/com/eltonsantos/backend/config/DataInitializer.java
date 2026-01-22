package com.eltonsantos.backend.config;

import com.eltonsantos.backend.entity.User;
import com.eltonsantos.backend.enums.Role;
import com.eltonsantos.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Initializes seed data with properly encoded passwords.
 * Updates existing users from Flyway migrations with correct BCrypt hashes.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Checking and updating admin password...");

        updateOrCreateUser(
            UUID.fromString("11111111-1111-1111-1111-111111111111"),
            "admin@lbc.local",
            "Admin123!",
            Role.ADMIN
        );

        log.info("Admin user verified.");
    }

    private void updateOrCreateUser(UUID id, String email, String password, Role role) {
        String encodedPassword = passwordEncoder.encode(password);

        userRepository.findById(id).ifPresentOrElse(
            user -> {
                if (!passwordEncoder.matches(password, user.getPasswordHash())) {
                    user.setPasswordHash(encodedPassword);
                    userRepository.save(user);
                    log.info("Updated password for user: {}", email);
                }
            },
            () -> {
                User user = User.builder()
                    .id(id)
                    .email(email)
                    .passwordHash(encodedPassword)
                    .role(role)
                    .build();
                userRepository.save(user);
                log.info("Created user: {}", email);
            }
        );
    }
}
