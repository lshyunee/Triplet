package com.ssafy.triplet.scheduler;


import com.ssafy.triplet.travel.repository.TravelRepository;
import com.ssafy.triplet.travel.service.TravelService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class ScheduledTasks {

    private final TravelService travelService;
    private final TravelRepository travelRepository;
    public ScheduledTasks(TravelService travelService, TravelRepository travelRepository) {
        this.travelService = travelService;
        this.travelRepository = travelRepository;
    }

    @Scheduled(cron = "0 59 23 * * *")
    public void executeTask() {
        LocalDate today = LocalDate.now();
        List<Long> travelIds = travelRepository.findTravelIdByEndDate(today);
        for (Long travelId : travelIds) {
            travelService.finishTravel(travelId);
        }
    }
}
