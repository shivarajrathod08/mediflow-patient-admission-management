package com.mediflow.controller;

import com.mediflow.dto.ApiResponse;
import com.mediflow.dto.CreatePatientRequestDto;
import com.mediflow.dto.PageResponse;
import com.mediflow.dto.PatientResponseDto;
import com.mediflow.dto.UpdatePatientRequestDto;
import com.mediflow.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/patients", "/patients"})
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<PatientResponseDto>>> getPatients(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long wardId,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) Long doctorId,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "admissionDate,desc") String sort) {

        String[] sortParts = sort.split(",");
        String property = sortParts[0];
        Sort.Direction direction = (sortParts.length > 1 && sortParts[1].equalsIgnoreCase("asc"))
                ? Sort.Direction.ASC : Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, property));
        PageResponse<PatientResponseDto> result = patientService.getPatients(search, wardId, departmentId, doctorId, status, pageable);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PatientResponseDto>> getPatientById(@PathVariable Long id) {
        PatientResponseDto patient = patientService.getPatientById(id);
        return ResponseEntity.ok(ApiResponse.success(patient));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PatientResponseDto>> createPatient(@Valid @RequestBody CreatePatientRequestDto request) {
        PatientResponseDto created = patientService.createPatient(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Patient admitted successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PatientResponseDto>> updatePatient(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePatientRequestDto request) {
        PatientResponseDto updated = patientService.updatePatient(id, request);
        return ResponseEntity.ok(ApiResponse.success("Patient record updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
        return ResponseEntity.ok(ApiResponse.success("Patient record deleted successfully", null));
    }

    @PatchMapping("/{id}/discharge")
    public ResponseEntity<ApiResponse<PatientResponseDto>> dischargePatient(@PathVariable Long id) {
        PatientResponseDto discharged = patientService.dischargePatient(id);
        return ResponseEntity.ok(ApiResponse.success("Patient marked as discharged successfully", discharged));
    }
}
