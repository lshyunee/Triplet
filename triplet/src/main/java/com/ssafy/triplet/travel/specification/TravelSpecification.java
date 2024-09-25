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
            int [][] month_range_list = {{12, 2}, {12, 2},{3, 5},{3, 5},{3, 5},{6, 8},{6, 8},{6, 8},{9, 11},{9, 11},{9, 11}};
            int [] month_range = month_range_list[month - 1];
            int startMonth = month_range[0];
            int endMonth = month_range[1];
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
