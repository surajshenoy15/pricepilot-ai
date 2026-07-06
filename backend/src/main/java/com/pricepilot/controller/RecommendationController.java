package com.pricepilot.controller;

import com.pricepilot.entity.*;
import com.pricepilot.repository.*;
import com.pricepilot.security.JwtUtil;
import com.pricepilot.service.PricingEngineService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationRepository recommendationRepo;
    private final MasterProductRepository masterProductRepo;
    private final MarketplaceProductRepository marketplaceProductRepo;
    private final PricingEngineService pricingEngine;
    private final JwtUtil jwtUtil;

    // =========================
    // DEBUG ENDPOINT
    // =========================
    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(recommendationRepo.count());
    }

    @GetMapping
    public ResponseEntity<List<Recommendation>> getAll(HttpServletRequest request) {

        Long tenantId = getTenantId(request);

        return ResponseEntity.ok(
                recommendationRepo.findByTenantIdOrderByCreatedAtDesc(tenantId)
        );
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Recommendation>> getPending(HttpServletRequest request) {

        Long tenantId = getTenantId(request);

        return ResponseEntity.ok(
                recommendationRepo.findByTenantIdAndStatus(
                        tenantId,
                        Recommendation.Status.PENDING
                )
        );
    }

    @PostMapping("/generate/{marketplaceProductId}")
    public ResponseEntity<Recommendation> generateRecommendation(
            @PathVariable Long marketplaceProductId) {

        MarketplaceProduct listing =
                marketplaceProductRepo.findById(marketplaceProductId).orElseThrow();

        MasterProduct product = listing.getMasterProduct();

        Recommendation recommendation =
                pricingEngine.generateRecommendation(product, listing);

        recommendation = recommendationRepo.save(recommendation);

        return ResponseEntity.ok(recommendation);
    }

    @PostMapping("/generate-all")
    public ResponseEntity<Map<String, Object>> generateAllRecommendations(
            HttpServletRequest request) {

        Long tenantId = getTenantId(request);

        List<MarketplaceProduct> lowSaleProducts =
                marketplaceProductRepo.findLowSaleProducts(tenantId);

        int generated = 0;

        for (MarketplaceProduct listing : lowSaleProducts) {

            MasterProduct product = listing.getMasterProduct();

            if (product != null && product.getCostPrice() != null) {

                Recommendation rec =
                        pricingEngine.generateRecommendation(product, listing);

                Recommendation saved = recommendationRepo.save(rec);

                // DEBUG
                System.out.println("--------------------------------");
                System.out.println("Saved recommendation ID = " + saved.getId());
                System.out.println("Tenant = " + saved.getTenant().getId());
                System.out.println("Product = " + saved.getMasterProduct().getId());
                System.out.println("Status = " + saved.getStatus());
                System.out.println("--------------------------------");

                generated++;
            }
        }

        return ResponseEntity.ok(Map.of(
                "message", "Recommendations generated",
                "count", generated
        ));
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<?> approve(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {

        System.out.println("====================================");
        System.out.println("APPROVE REQUEST");
        System.out.println("ID = " + id);

        System.out.println("Total recommendations = " + recommendationRepo.count());

        recommendationRepo.findAll().forEach(r ->
                System.out.println("DB Recommendation -> id=" + r.getId() +
                        ", status=" + r.getStatus())
        );

        Recommendation rec = recommendationRepo.findById(id).orElse(null);

        if (rec == null) {
            System.out.println("Recommendation NOT FOUND!");

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "error", "Recommendation not found",
                            "requestedId", id
                    )
            );
        }

        rec.setStatus(Recommendation.Status.APPROVED);

        if (body != null) {
            rec.setApprovalComments(body.getOrDefault("comments", ""));
        }

        rec.setApprovedAt(LocalDateTime.now());

        recommendationRepo.save(rec);

        System.out.println("Recommendation Approved Successfully");
        System.out.println("====================================");

        return ResponseEntity.ok(rec);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@PathVariable Long id) {

        System.out.println("Searching recommendation id = " + id);

        return ResponseEntity.ok(
                recommendationRepo.findById(id).orElse(null)
        );
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<?> reject(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {

        Recommendation rec = recommendationRepo.findById(id).orElse(null);

        if (rec == null) {
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "error", "Recommendation not found",
                            "requestedId", id
                    )
            );
        }

        rec.setStatus(Recommendation.Status.REJECTED);

        if (body != null) {
            rec.setApprovalComments(body.getOrDefault("comments", ""));
        }

        rec.setApprovedAt(LocalDateTime.now());

        recommendationRepo.save(rec);

        return ResponseEntity.ok(rec);
    }

    private Long getTenantId(HttpServletRequest request) {

        String auth = request.getHeader("Authorization");

        System.out.println("==================================");
        System.out.println("AUTH HEADER = " + auth);

        if (auth == null) {
            throw new RuntimeException("Authorization header is NULL");
        }

        String token = auth.substring(7);

        System.out.println("TOKEN = " + token);

        Long tenantId = jwtUtil.getTenantIdFromToken(token);

        System.out.println("TENANT ID = " + tenantId);
        System.out.println("==================================");

        return tenantId;
    }
}