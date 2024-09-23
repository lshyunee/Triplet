package com.ssafy.triplet.travel.repository;

import com.ssafy.triplet.travel.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    @Query("SELECT c.categoryName FROM Category c WHERE c.categoryId = :id")
    String findCategoryNameByCategoryId(int id);
}
