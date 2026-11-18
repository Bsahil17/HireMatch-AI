package com.hirematch.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hirematch.entity.User;
import com.hirematch.enums.Role;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtTokenProvider {

    @Value("${app.jwt.secret:HireMatchAiSuperSecretJwtKey2026WithSufficientEntropyAndStrength!}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms:604800000}") // 7 days default
    private long jwtExpirationMs;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public String generateToken(User user) {
        try {
            long now = Instant.now().getEpochSecond();
            long exp = now + (jwtExpirationMs / 1000);

            Map<String, Object> header = new HashMap<>();
            header.put("alg", "HS256");
            header.put("typ", "JWT");

            Map<String, Object> payload = new HashMap<>();
            payload.put("sub", user.getId().toString());
            payload.put("email", user.getEmail());
            payload.put("name", user.getFullName());
            payload.put("role", user.getRole().name());
            payload.put("iat", now);
            payload.put("exp", exp);

            String encodedHeader = Base64.getUrlEncoder().withoutPadding().encodeToString(
                    objectMapper.writeValueAsString(header).getBytes(StandardCharsets.UTF_8));
            String encodedPayload = Base64.getUrlEncoder().withoutPadding().encodeToString(
                    objectMapper.writeValueAsString(payload).getBytes(StandardCharsets.UTF_8));

            String dataToSign = encodedHeader + "." + encodedPayload;
            String signature = signHmacSha256(dataToSign, jwtSecret);

            return dataToSign + "." + signature;
        } catch (Exception e) {
            throw new RuntimeException("Could not generate JWT token", e);
        }
    }

    public boolean validateToken(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) return false;

            String dataToSign = parts[0] + "." + parts[1];
            String expectedSig = signHmacSha256(dataToSign, jwtSecret);

            if (!MessageDigest.isEqual(expectedSig.getBytes(StandardCharsets.UTF_8), parts[2].getBytes(StandardCharsets.UTF_8))) {
                return false;
            }

            Map<String, Object> payload = parsePayload(token);
            long exp = ((Number) payload.get("exp")).longValue();
            return Instant.now().getEpochSecond() < exp;
        } catch (Exception e) {
            return false;
        }
    }

    public Long getUserIdFromToken(String token) {
        Map<String, Object> payload = parsePayload(token);
        return Long.parseLong((String) payload.get("sub"));
    }

    public String getEmailFromToken(String token) {
        Map<String, Object> payload = parsePayload(token);
        return (String) payload.get("email");
    }

    public Role getRoleFromToken(String token) {
        Map<String, Object> payload = parsePayload(token);
        return Role.valueOf((String) payload.get("role"));
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> parsePayload(String token) {
        try {
            String[] parts = token.split("\\.");
            byte[] bytes = Base64.getUrlDecoder().decode(parts[1]);
            return objectMapper.readValue(bytes, Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Invalid JWT payload", e);
        }
    }

    private String signHmacSha256(String data, String key) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        mac.init(secretKey);
        byte[] hmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return Base64.getUrlEncoder().withoutPadding().encodeToString(hmac);
    }
}
