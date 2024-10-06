package com.ssafy.triplet.travel.dto.response;

import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.annotations.Mapping;

@Getter
@Setter
@Document(indexName = "travel")
@Mapping(mappingPath = "static/elastic-travel-mapping.json")
public class TravelFeedListResponse {

    @Field(name = "country_id",type = FieldType.Integer)
    private int countryId;

    @Field(name = "creator_id", type = FieldType.Long)
    private Long creatorId;

    @Field(name = "days",type = FieldType.Integer)
    private int days;

    @Id
    @Field(name = "id", type = FieldType.Long)
    private Long id;

    @Field(type = FieldType.Text)
    private String image;

    @Field(name="is_shared", type = FieldType.Boolean)
    private boolean isShared;

    @Field(name = "member_count",type = FieldType.Integer)
    private int memberCount;

    @Field(name = "share_status",type = FieldType.Boolean)
    private boolean shareStatus;

    @Field(name = "status",type = FieldType.Boolean)
    private boolean status;

    @Field(type = FieldType.Text)
    private String title;

    @Field(name = "total_budget",type = FieldType.Double)
    private double totalBudget;

    @Field(name = "total_budget_won",type = FieldType.Double)
    private double totalBudgetWon;
}
