package com.mediflow.validation;

import com.mediflow.dto.CreatePatientRequestDto;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class PatientValidationTest {

    private static Validator validator;

    @BeforeAll
    static void init() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    private CreatePatientRequestDto buildValidDto() {
        CreatePatientRequestDto dto = new CreatePatientRequestDto();
        dto.setName("Alexander Vance");
        dto.setAge(42);
        dto.setGender("Male");
        dto.setWardId(1L);
        dto.setDepartmentId(1L);
        dto.setDoctorId(1L);
        dto.setAdmissionDate(LocalDate.now());
        dto.setDiagnosis("Routine Observation");
        return dto;
    }

    @Test
    @DisplayName("Valid DTO should have no constraint violations")
    void testValidDto() {
        CreatePatientRequestDto dto = buildValidDto();
        Set<ConstraintViolation<CreatePatientRequestDto>> violations = validator.validate(dto);
        assertThat(violations).isEmpty();
    }

    @Test
    @DisplayName("Missing patient name should trigger violation")
    void testMissingName() {
        CreatePatientRequestDto dto = buildValidDto();
        dto.setName(null);
        Set<ConstraintViolation<CreatePatientRequestDto>> violations = validator.validate(dto);
        assertThat(violations).anyMatch(v -> v.getPropertyPath().toString().equals("name"));
    }

    @Test
    @DisplayName("Patient name containing digits or special symbols should trigger violation")
    void testInvalidNameWithDigits() {
        CreatePatientRequestDto dto = buildValidDto();
        dto.setName("John123 Doe");
        Set<ConstraintViolation<CreatePatientRequestDto>> violations = validator.validate(dto);
        assertThat(violations).anyMatch(v -> v.getPropertyPath().toString().equals("name"));
    }

    @Test
    @DisplayName("Age below 0 should trigger violation")
    void testNegativeAge() {
        CreatePatientRequestDto dto = buildValidDto();
        dto.setAge(-1);
        Set<ConstraintViolation<CreatePatientRequestDto>> violations = validator.validate(dto);
        assertThat(violations).anyMatch(v -> v.getPropertyPath().toString().equals("age"));
    }

    @Test
    @DisplayName("Age above 120 should trigger violation")
    void testAgeAbove120() {
        CreatePatientRequestDto dto = buildValidDto();
        dto.setAge(121);
        Set<ConstraintViolation<CreatePatientRequestDto>> violations = validator.validate(dto);
        assertThat(violations).anyMatch(v -> v.getPropertyPath().toString().equals("age"));
    }

    @Test
    @DisplayName("Invalid gender should trigger violation")
    void testInvalidGender() {
        CreatePatientRequestDto dto = buildValidDto();
        dto.setGender("Alien");
        Set<ConstraintViolation<CreatePatientRequestDto>> violations = validator.validate(dto);
        assertThat(violations).anyMatch(v -> v.getPropertyPath().toString().equals("gender"));
    }

    @Test
    @DisplayName("Future admission date should trigger violation")
    void testFutureAdmissionDate() {
        CreatePatientRequestDto dto = buildValidDto();
        dto.setAdmissionDate(LocalDate.now().plusDays(5));
        Set<ConstraintViolation<CreatePatientRequestDto>> violations = validator.validate(dto);
        assertThat(violations).anyMatch(v -> v.getPropertyPath().toString().equals("admissionDate"));
    }
}
