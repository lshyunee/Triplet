package com.ssafy.triplet.travel.dto.request;

import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.annotations.Mapping;

import java.util.List;

@Getter
@Setter
@Document(indexName = "member")
@Mapping(mappingPath = "static/elastic-member-mapping.json")
public class MemberDocument {

    @Field(name = "age",type = FieldType.Integer)
    private int age;

    @Field(name = "gender",type = FieldType.Integer)
    private int gender;

    @Id
    @Field(name = "id", type = FieldType.Long)
    private Long id;

    @Field(name = "is_notification_enabled", type = FieldType.Boolean)
    private boolean isNotificationEnabled;

    @Field(name = "travels", type = FieldType.Text)
    private List<String> travels;

}
