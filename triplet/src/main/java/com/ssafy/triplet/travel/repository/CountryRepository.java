package com.ssafy.triplet.travel.repository;

import com.ssafy.triplet.travel.entity.Country;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CountryRepository extends JpaRepository<Country, Integer> {
//    Optional<Country> findByCountryId(int countryId);
}
