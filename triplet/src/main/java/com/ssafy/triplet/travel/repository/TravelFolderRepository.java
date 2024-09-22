package com.ssafy.triplet.travel.repository;

import com.ssafy.triplet.travel.entity.TravelFolder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TravelFolderRepository extends JpaRepository<TravelFolder, Long> {
}
