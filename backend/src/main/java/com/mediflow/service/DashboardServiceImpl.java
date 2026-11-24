package com.mediflow.service;

import com.mediflow.dto.DashboardSummaryDto;
import com.mediflow.dto.PatientResponseDto;
import com.mediflow.entity.Patient;
import com.mediflow.entity.PatientStatus;
import com.mediflow.entity.Ward;
import com.mediflow.repository.DepartmentRepository;
import com.mediflow.repository.PatientRepository;
import com.mediflow.repository.WardRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final PatientRepository patientRepository;
    private final DepartmentRepository departmentRepository;
    private final WardRepository wardRepository;

    public DashboardServiceImpl(PatientRepository patientRepository,
                                DepartmentRepository departmentRepository,
                                WardRepository wardRepository) {
        this.patientRepository = patientRepository;
        this.departmentRepository = departmentRepository;
        this.wardRepository = wardRepository;
    }

    @Override
    public DashboardSummaryDto getDashboardSummary() {
        long totalPatients = patientRepository.count();
        long admittedPatients = patientRepository.countByStatus(PatientStatus.ADMITTED);
        long dischargedPatients = patientRepository.countByStatus(PatientStatus.DISCHARGED);
        long admissionsToday = patientRepository.countByAdmissionDate(LocalDate.now());

        // Department distribution
        List<Object[]> deptCounts = patientRepository.countPatientsByDepartment();
        List<DashboardSummaryDto.DepartmentStatDto> departmentDistribution = new ArrayList<>();
        for (Object[] row : deptCounts) {
            Long deptId = (Long) row[0];
            String deptName = (String) row[1];
            long count = ((Number) row[2]).longValue();
            double pct = totalPatients > 0 ? Math.round(((double) count / totalPatients * 100.0) * 10.0) / 10.0 : 0.0;
            departmentDistribution.add(new DashboardSummaryDto.DepartmentStatDto(deptId, deptName, count, pct));
        }

        // Ward occupancy rates
        List<Ward> allWards = wardRepository.findAll();
        List<Object[]> wardAdmittedCounts = patientRepository.countAdmittedPatientsByWard();
        Map<Long, Long> admittedMap = new HashMap<>();
        for (Object[] row : wardAdmittedCounts) {
            Long wardId = (Long) row[0];
            long admitted = ((Number) row[3]).longValue();
            admittedMap.put(wardId, admitted);
        }

        List<DashboardSummaryDto.WardOccupancyDto> wardOccupancy = allWards.stream().map(w -> {
            long admitted = admittedMap.getOrDefault(w.getId(), 0L);
            int capacity = w.getCapacity() != null && w.getCapacity() > 0 ? w.getCapacity() : 30;
            double rate = Math.round(((double) admitted / capacity * 100.0) * 10.0) / 10.0;
            return new DashboardSummaryDto.WardOccupancyDto(w.getId(), w.getName(), admitted, capacity, rate);
        }).collect(Collectors.toList());

        // Recent admissions
        List<Patient> recent = patientRepository.findTop5ByOrderByCreatedAtDesc();
        List<PatientResponseDto> recentDtos = recent.stream().map(this::mapToDto).collect(Collectors.toList());

        return new DashboardSummaryDto(
                totalPatients,
                admittedPatients,
                dischargedPatients,
                admissionsToday,
                departmentDistribution,
                wardOccupancy,
                recentDtos
        );
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
