package com.mediflow.service;

import com.mediflow.dto.CreatePatientRequestDto;
import com.mediflow.dto.PageResponse;
import com.mediflow.dto.PatientResponseDto;
import com.mediflow.dto.UpdatePatientRequestDto;
import com.mediflow.entity.*;
import com.mediflow.exception.BusinessRuleException;
import com.mediflow.exception.ResourceNotFoundException;
import com.mediflow.repository.DepartmentRepository;
import com.mediflow.repository.DoctorRepository;
import com.mediflow.repository.PatientRepository;
import com.mediflow.repository.WardRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@Transactional
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final WardRepository wardRepository;
    private final DepartmentRepository departmentRepository;
    private final DoctorRepository doctorRepository;

    public PatientServiceImpl(PatientRepository patientRepository,
                              WardRepository wardRepository,
                              DepartmentRepository departmentRepository,
                              DoctorRepository doctorRepository) {
        this.patientRepository = patientRepository;
        this.wardRepository = wardRepository;
        this.departmentRepository = departmentRepository;
        this.doctorRepository = doctorRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<PatientResponseDto> getPatients(String search, Long wardId, Long departmentId, Long doctorId, String status, Pageable pageable) {
        String trimmedSearch = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
        PatientStatus patientStatus = null;
        if (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("ALL")) {
            try {
                patientStatus = PatientStatus.valueOf(status.trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                // If invalid status string provided, ignore or treat as null
            }
        }

        org.springframework.data.jpa.domain.Specification<Patient> spec =
                com.mediflow.specification.PatientSpecification.withFilters(trimmedSearch, wardId, departmentId, doctorId, patientStatus);

        Page<Patient> page = patientRepository.findAll(spec, pageable);

        Page<PatientResponseDto> dtoPage = page.map(this::mapToDto);

        return new PageResponse<>(
                dtoPage.getContent(),
                dtoPage.getNumber(),
                dtoPage.getSize(),
                dtoPage.getTotalElements(),
                dtoPage.getTotalPages(),
                dtoPage.isLast()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public PatientResponseDto getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        return mapToDto(patient);
    }

    @Override
    public PatientResponseDto createPatient(CreatePatientRequestDto request) {
        // Validate Ward
        Ward ward = wardRepository.findById(request.getWardId())
                .orElseThrow(() -> new ResourceNotFoundException("Ward not found with id: " + request.getWardId()));

        // Validate Department
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + request.getDepartmentId()));

        // Validate Doctor
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + request.getDoctorId()));

        // Verify doctor belongs to selected department
        if (!doctor.getDepartment().getId().equals(department.getId())) {
            throw new BusinessRuleException("Selected doctor '" + doctor.getName() + "' does not belong to department '" + department.getName() + "'");
        }

        // Verify admission date not in future
        if (request.getAdmissionDate().isAfter(LocalDate.now())) {
            throw new BusinessRuleException("Admission date cannot be in the future");
        }

        Patient patient = new Patient();
        patient.setName(request.getName().trim());
        patient.setAge(request.getAge());
        patient.setGender(normalizeGender(request.getGender()));
        patient.setWard(ward);
        patient.setDepartment(department);
        patient.setDoctor(doctor);
        patient.setAdmissionDate(request.getAdmissionDate());
        patient.setStatus(PatientStatus.ADMITTED);
        patient.setDiagnosis(request.getDiagnosis());

        // Generate patient code
        Long maxId = patientRepository.findMaxId();
        long nextNum = (maxId != null ? maxId : 0L) + 1001L;
        patient.setPatientCode("PAT-" + nextNum);

        Patient saved = patientRepository.save(patient);
        return mapToDto(saved);
    }

    @Override
    public PatientResponseDto updatePatient(Long id, UpdatePatientRequestDto request) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));

        // Validate Ward
        Ward ward = wardRepository.findById(request.getWardId())
                .orElseThrow(() -> new ResourceNotFoundException("Ward not found with id: " + request.getWardId()));

        // Validate Department
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + request.getDepartmentId()));

        // Validate Doctor
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + request.getDoctorId()));

        // Verify doctor belongs to selected department
        if (!doctor.getDepartment().getId().equals(department.getId())) {
            throw new BusinessRuleException("Selected doctor '" + doctor.getName() + "' does not belong to department '" + department.getName() + "'");
        }

        // Verify admission date not in future
        if (request.getAdmissionDate().isAfter(LocalDate.now())) {
            throw new BusinessRuleException("Admission date cannot be in the future");
        }

        patient.setName(request.getName().trim());
        patient.setAge(request.getAge());
        patient.setGender(normalizeGender(request.getGender()));
        patient.setWard(ward);
        patient.setDepartment(department);
        patient.setDoctor(doctor);
        patient.setAdmissionDate(request.getAdmissionDate());
        patient.setDiagnosis(request.getDiagnosis());

        if (request.getStatus() != null && !request.getStatus().trim().isEmpty()) {
            try {
                patient.setStatus(PatientStatus.valueOf(request.getStatus().trim().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new BusinessRuleException("Invalid status: " + request.getStatus() + ". Status must be ADMITTED or DISCHARGED");
            }
        }

        Patient updated = patientRepository.save(patient);
        return mapToDto(updated);
    }

    @Override
    public void deletePatient(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        patientRepository.delete(patient);
    }

    @Override
    public PatientResponseDto dischargePatient(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));

        if (patient.getStatus() == PatientStatus.DISCHARGED) {
            throw new IllegalStateException("Patient #" + patient.getPatientCode() + " is already marked as DISCHARGED");
        }

        patient.setStatus(PatientStatus.DISCHARGED);
        Patient updated = patientRepository.save(patient);
        return mapToDto(updated);
    }

    private String normalizeGender(String input) {
        if (input == null) return "Other";
        String trimmed = input.trim();
        if (trimmed.equalsIgnoreCase("Male")) return "Male";
        if (trimmed.equalsIgnoreCase("Female")) return "Female";
        return "Other";
    }

    private PatientResponseDto mapToDto(Patient p) {
        PatientResponseDto dto = new PatientResponseDto();
        dto.setId(p.getId());
        dto.setPatientCode(p.getPatientCode());
        dto.setName(p.getName());
        dto.setAge(p.getAge());
        dto.setGender(p.getGender());
        dto.setWardId(p.getWard().getId());
        dto.setWardName(p.getWard().getName());
        dto.setDepartmentId(p.getDepartment().getId());
        dto.setDepartmentName(p.getDepartment().getName());
        dto.setDoctorId(p.getDoctor().getId());
        dto.setDoctorName(p.getDoctor().getName());
        dto.setAdmissionDate(p.getAdmissionDate());
        dto.setStatus(p.getStatus().name());
        dto.setDiagnosis(p.getDiagnosis());
        dto.setCreatedAt(p.getCreatedAt());
        dto.setUpdatedAt(p.getUpdatedAt());
        return dto;
    }
}
