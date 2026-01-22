package com.eltonsantos.backend.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Utility class to generate BCrypt password hashes.
 * Run the main method to generate hashes for the seed data.
 */
public class PasswordGenerator {

    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);

        System.out.println("=== BCrypt Password Hashes ===");
        System.out.println("Admin123!: " + encoder.encode("Admin123!"));
        System.out.println("Manager123!: " + encoder.encode("Manager123!"));
        System.out.println("Collab123!: " + encoder.encode("Collab123!"));
    }
}
