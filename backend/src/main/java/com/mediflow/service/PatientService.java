package com.mediflow.service;

import com.mediflow.dto.CreatePatientRequestDto;
import com.mediflow.dto.PageResponse;
import com.mediflow.dto.PatientResponseDto;
import com.mediflow.dto.UpdatePatientRequestDto;
import org.springframework.data.domain.Pageable;

public interface PatientService {

    PageResponse<PatientResponseDto> getPatients(String search, Long wardId, Long departmentId, Long doctorId, String status, Pageable pageable);

    PatientResponseDto getPatientById(Long id);

    PatientResponseDto createPatient(CreatePatientRequestDto request);

    PatientResponseDto updatePatient(Long id, UpdatePatientRequestDto request);

    void deletePatient(Long id);

    PatientResponseDto dischargePatient(Long id);
}
