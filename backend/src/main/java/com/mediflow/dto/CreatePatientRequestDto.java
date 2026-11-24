package com.mediflow.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public class CreatePatientRequestDto {

    @NotBlank(message = "Patient name is required")
    @Size(min = 2, max = 100, message = "Patient name must be between 2 and 100 characters")
    @Pattern(regexp = "^[\\p{L} .'-]+$", message = "Patient name must contain only letters and allowed separators (spaces, dots, hyphens)")
    private String name;

    @NotNull(message = "Age is required")
    @Min(value = 0, message = "Age must be at least 0")
    @Max(value = 120, message = "Age must not exceed 120")
    private Integer age;

    @NotBlank(message = "Gender is required")
    @Pattern(regexp = "(?i)^(Male|Female|Other)$", message = "Gender must be Male, Female, or Other")
    private String gender;

    @NotNull(message = "Ward ID is required")
    private Long wardId;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    @NotNull(message = "Doctor ID is required")
    private Long doctorId;

    @NotNull(message = "Admission date is required")
    @PastOrPresent(message = "Admission date cannot be in the future")
    private LocalDate admissionDate;

    @Size(max = 255, message = "Diagnosis description must not exceed 255 characters")
    private String diagnosis;

    public CreatePatientRequestDto() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Long getWardId() {
        return wardId;
    }

    public void setWardId(Long wardId) {
        this.wardId = wardId;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public LocalDate getAdmissionDate() {
        return admissionDate;
    }

    public void setAdmissionDate(LocalDate admissionDate) {
        this.admissionDate = admissionDate;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }
}
