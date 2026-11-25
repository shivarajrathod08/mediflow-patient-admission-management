package com.mediflow.service;

import com.mediflow.dto.DashboardSummaryDto;
import com.mediflow.entity.Department;
import com.mediflow.entity.Doctor;
import com.mediflow.entity.Patient;
import com.mediflow.entity.PatientStatus;
import com.mediflow.entity.Ward;
import com.mediflow.repository.DepartmentRepository;
import com.mediflow.repository.PatientRepository;
import com.mediflow.repository.WardRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private PatientRepository patientRepository;

    @Mock
    private DepartmentRepository departmentRepository;

    @Mock
    private WardRepository wardRepository;

    @InjectMocks
    private DashboardServiceImpl dashboardService;

    private Ward testWard;
    private Department testDept;
    private Doctor testDoctor;
    private Patient testPatient;

    @BeforeEach
    void setUp() {
        testDept = new Department(1L, "Cardiology", "CARD");
        testWard = new Ward(1L, "Ward 4B", "W4B", 30);
        testDoctor = new Doctor(1L, "Dr. Smith", testDept, "Cardiologist");

        testPatient = new Patient();
        testPatient.setId(1L);
        testPatient.setPatientCode("PAT-1001");
        testPatient.setName("John Doe");
        testPatient.setAge(45);
        testPatient.setGender("Male");
        testPatient.setWard(testWard);
        testPatient.setDepartment(testDept);
        testPatient.setDoctor(testDoctor);
        testPatient.setAdmissionDate(LocalDate.now());
        testPatient.setStatus(PatientStatus.ADMITTED);
        testPatient.setDiagnosis("Stable");
        testPatient.setCreatedAt(OffsetDateTime.now());
    }

    @Test
    @DisplayName("Should return accurate dashboard summary metrics and distributions")
    void shouldReturnDashboardSummary() {
        when(patientRepository.count()).thenReturn(10L);
        when(patientRepository.countByStatus(PatientStatus.ADMITTED)).thenReturn(7L);
        when(patientRepository.countByStatus(PatientStatus.DISCHARGED)).thenReturn(3L);
        when(patientRepository.countByAdmissionDate(any(LocalDate.class))).thenReturn(2L);

        List<Object[]> deptRows = Collections.singletonList(new Object[]{1L, "Cardiology", 5L});
        when(patientRepository.countPatientsByDepartment()).thenReturn(deptRows);

        when(wardRepository.findAll()).thenReturn(List.of(testWard));
        List<Object[]> wardRows = Collections.singletonList(new Object[]{1L, "Ward 4B", 30, 3L});
        when(patientRepository.countAdmittedPatientsByWard()).thenReturn(wardRows);

        when(patientRepository.findTop5ByOrderByCreatedAtDesc()).thenReturn(List.of(testPatient));

        DashboardSummaryDto result = dashboardService.getDashboardSummary();

        assertThat(result).isNotNull();
        assertThat(result.getTotalPatients()).isEqualTo(10L);
        assertThat(result.getAdmittedPatients()).isEqualTo(7L);
        assertThat(result.getDischargedPatients()).isEqualTo(3L);
        assertThat(result.getAdmissionsToday()).isEqualTo(2L);

        assertThat(result.getDepartmentDistribution()).hasSize(1);
        assertThat(result.getDepartmentDistribution().get(0).getDepartmentName()).isEqualTo("Cardiology");
        assertThat(result.getDepartmentDistribution().get(0).getPatientCount()).isEqualTo(5L);
        assertThat(result.getDepartmentDistribution().get(0).getPercentage()).isEqualTo(50.0);

        assertThat(result.getWardOccupancy()).hasSize(1);
        assertThat(result.getWardOccupancy().get(0).getWardName()).isEqualTo("Ward 4B");
        assertThat(result.getWardOccupancy().get(0).getAdmittedCount()).isEqualTo(3L);
        assertThat(result.getWardOccupancy().get(0).getTotalCapacity()).isEqualTo(30);
        assertThat(result.getWardOccupancy().get(0).getOccupancyRate()).isEqualTo(10.0);

        assertThat(result.getRecentAdmissions()).hasSize(1);
        assertThat(result.getRecentAdmissions().get(0).getPatientCode()).isEqualTo("PAT-1001");
    }

    @Test
    @DisplayName("Should handle empty database gracefully without division by zero errors")
    void shouldHandleEmptyDatabaseGracefully() {
        when(patientRepository.count()).thenReturn(0L);
        when(patientRepository.countByStatus(PatientStatus.ADMITTED)).thenReturn(0L);
        when(patientRepository.countByStatus(PatientStatus.DISCHARGED)).thenReturn(0L);
        when(patientRepository.countByAdmissionDate(any(LocalDate.class))).thenReturn(0L);
        when(patientRepository.countPatientsByDepartment()).thenReturn(Collections.emptyList());
        when(wardRepository.findAll()).thenReturn(Collections.emptyList());
        when(patientRepository.countAdmittedPatientsByWard()).thenReturn(Collections.emptyList());
        when(patientRepository.findTop5ByOrderByCreatedAtDesc()).thenReturn(Collections.emptyList());

        DashboardSummaryDto result = dashboardService.getDashboardSummary();

        assertThat(result).isNotNull();
        assertThat(result.getTotalPatients()).isZero();
        assertThat(result.getDepartmentDistribution()).isEmpty();
        assertThat(result.getWardOccupancy()).isEmpty();
        assertThat(result.getRecentAdmissions()).isEmpty();
    }
}
