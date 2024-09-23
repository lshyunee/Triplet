package com.ssafy.triplet.travel.specification;

import com.ssafy.triplet.travel.entity.Travel;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

public class TravelSpecification {

    public static Specification<Travel> excludeCreator(Long userId) {
        return (root, query, criteriaBuilder) -> {
            if (userId == null) {
                return criteriaBuilder.conjunction(); // 아무런 조건도 추가하지 않음
            }
            return criteriaBuilder.notEqual(root.get("creatorId"), userId);
        };
    }

    // Country 이름 검색
    public static Specification<Travel> countryNameContains(String countryName) {
        return (root, query, criteriaBuilder) -> {
            if (countryName == null || countryName.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            Join<Object, Object> country = root.join("country");
            return criteriaBuilder.like(country.get("name"), "%" + countryName + "%");
        };
    }

    // 멤버 수 필터링
    public static Specification<Travel> memberCountEquals(int memberCount) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("memberCount"), memberCount);
    }

    // 총 예산 필터링
    public static Specification<Travel> totalBudgetWonBetween(double minBudget, double maxBudget) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.between(root.get("totalBudgetWon"), minBudget, maxBudget);
    }

    // 여행 시기 필터링 (계절별 검색)
    public static Specification<Travel> travelMonth(int month) {
        return (root, query, criteriaBuilder) -> {
            int startMonth;
            int endMonth;
            if (month >= 3 && month <= 5) {
                startMonth = 3;
                endMonth = 5;
            } else if (month >= 6 && month <= 8) {
                startMonth = 6;
                endMonth = 8;
            } else if (month >= 9 && month <= 11) {
                startMonth = 9;
                endMonth = 11;
            } else {
                if (month == 12) {
                    startMonth = 12;
                    endMonth = 2;
                } else {
                    startMonth = 1;
                    endMonth = 2;
                }
            }
            return criteriaBuilder.between(criteriaBuilder.function("month", Integer.class, root.get("startDate")), startMonth, endMonth);
        };
    }

    // 기간 필터링
    public static Specification<Travel> travelDurationBetween(int minDays, int maxDays) {
        return (root, query, criteriaBuilder) -> {
            Expression<Long> daysDiff = criteriaBuilder.function(
                    "datediff", Long.class, root.get("endDate"), root.get("startDate")
            );
            int adjustedMinDays = minDays - 1;
            int adjustedMaxDays = maxDays + 1;
            return criteriaBuilder.between(daysDiff, (long) adjustedMinDays, (long) adjustedMaxDays);
        };
    }




}
