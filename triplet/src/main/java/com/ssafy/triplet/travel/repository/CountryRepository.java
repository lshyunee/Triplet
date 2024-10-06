package com.ssafy.triplet.travel.repository;

import com.ssafy.triplet.travel.dto.response.CountryResponse;
import com.ssafy.triplet.travel.entity.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CountryRepository extends JpaRepository<Country, Integer> {
    @Query("SELECT new com.ssafy.triplet.travel.dto.response.CountryResponse(c.id, c.name, c.currency) FROM Country c")
    List<CountryResponse> getAllCountries();

    @Query("SELECT c.id FROM Country c WHERE c.name = :name")
    int findIdByCountryName(String name);
}
