package com.mediflow.service;

import com.mediflow.dto.CreatePatientRequestDto;
import com.mediflow.dto.PatientResponseDto;
import com.mediflow.dto.UpdatePatientRequestDto;
import com.mediflow.entity.Department;
import com.mediflow.entity.Doctor;
import com.mediflow.entity.Patient;
import com.mediflow.entity.PatientStatus;
import com.mediflow.entity.Ward;
import com.mediflow.exception.BusinessRuleException;
import com.mediflow.exception.ResourceNotFoundException;
import com.mediflow.repository.DepartmentRepository;
import com.mediflow.repository.DoctorRepository;
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
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PatientServiceTest {

    @Mock
    private PatientRepository patientRepository;

    @Mock
    private WardRepository wardRepository;

    @Mock
    private DepartmentRepository departmentRepository;

    @Mock
    private DoctorRepository doctorRepository;

    @InjectMocks
    private PatientServiceImpl patientService;

    private Ward ward;
    private Department deptCardio;
    private Department deptNeuro;
    private Doctor docCardio;
    private Doctor docNeuro;

    @BeforeEach
    void setUp() {
        deptCardio = new Department(1L, "Cardiology", "CARD");
        deptNeuro = new Department(2L, "Neurology", "NEURO");

        ward = new Ward(1L, "Ward 4B", "W4B", 30);

        docCardio = new Doctor(1L, "Dr. Sarah Jenkins", deptCardio, "Cardiologist");
        docNeuro = new Doctor(2L, "Dr. Michael Zhao", deptNeuro, "Neurologist");
    }

    @Test
    @DisplayName("Should successfully create a patient with ADMITTED status and generated code")
    void testSuccessfulPatientCreation() {
        CreatePatientRequestDto request = new CreatePatientRequestDto();
        request.setName("John Doe");
        request.setAge(45);
        request.setGender("Male");
        request.setWardId(1L);
        request.setDepartmentId(1L);
        request.setDoctorId(1L);
        request.setAdmissionDate(LocalDate.now());

        when(wardRepository.findById(1L)).thenReturn(Optional.of(ward));
        when(departmentRepository.findById(1L)).thenReturn(Optional.of(deptCardio));
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(docCardio));
        when(patientRepository.findMaxId()).thenReturn(10L);

        when(patientRepository.save(any(Patient.class))).thenAnswer(invocation -> {
            Patient p = invocation.getArgument(0);
            p.setId(11L);
            return p;
        });

        PatientResponseDto result = patientService.createPatient(request);

        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("John Doe");
        assertThat(result.getPatientCode()).isEqualTo("PAT-1011");
        assertThat(result.getStatus()).isEqualTo("ADMITTED");
        assertThat(result.getWardName()).isEqualTo("Ward 4B");
        assertThat(result.getDepartmentName()).isEqualTo("Cardiology");
        assertThat(result.getDoctorName()).isEqualTo("Dr. Sarah Jenkins");

        verify(patientRepository, times(1)).save(any(Patient.class));
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when ward does not exist")
    void testInvalidWard() {
        CreatePatientRequestDto request = new CreatePatientRequestDto();
        request.setName("Jane Smith");
        request.setAge(30);
        request.setGender("Female");
        request.setWardId(999L);
        request.setDepartmentId(1L);
        request.setDoctorId(1L);
        request.setAdmissionDate(LocalDate.now());

        when(wardRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> patientService.createPatient(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Ward not found with id: 999");

        verify(patientRepository, never()).save(any(Patient.class));
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when department does not exist")
    void testInvalidDepartment() {
        CreatePatientRequestDto request = new CreatePatientRequestDto();
        request.setName("Jane Smith");
        request.setAge(30);
        request.setGender("Female");
        request.setWardId(1L);
        request.setDepartmentId(888L);
        request.setDoctorId(1L);
        request.setAdmissionDate(LocalDate.now());

        when(wardRepository.findById(1L)).thenReturn(Optional.of(ward));
        when(departmentRepository.findById(888L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> patientService.createPatient(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Department not found with id: 888");

        verify(patientRepository, never()).save(any(Patient.class));
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when doctor does not exist")
    void testInvalidDoctor() {
        CreatePatientRequestDto request = new CreatePatientRequestDto();
        request.setName("Jane Smith");
        request.setAge(30);
        request.setGender("Female");
        request.setWardId(1L);
        request.setDepartmentId(1L);
        request.setDoctorId(777L);
        request.setAdmissionDate(LocalDate.now());

        when(wardRepository.findById(1L)).thenReturn(Optional.of(ward));
        when(departmentRepository.findById(1L)).thenReturn(Optional.of(deptCardio));
        when(doctorRepository.findById(777L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> patientService.createPatient(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Doctor not found with id: 777");

        verify(patientRepository, never()).save(any(Patient.class));
    }

    @Test
    @DisplayName("Should throw BusinessRuleException when doctor does not belong to selected department")
    void testDoctorBelongingToAnotherDepartment() {
        CreatePatientRequestDto request = new CreatePatientRequestDto();
        request.setName("Jane Smith");
        request.setAge(30);
        request.setGender("Female");
        request.setWardId(1L);
        request.setDepartmentId(1L); // Cardiology
        request.setDoctorId(2L);     // Doctor Michael Zhao (Neurology)
        request.setAdmissionDate(LocalDate.now());

        when(wardRepository.findById(1L)).thenReturn(Optional.of(ward));
        when(departmentRepository.findById(1L)).thenReturn(Optional.of(deptCardio));
        when(doctorRepository.findById(2L)).thenReturn(Optional.of(docNeuro));

        assertThatThrownBy(() -> patientService.createPatient(request))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("does not belong to department 'Cardiology'");

        verify(patientRepository, never()).save(any(Patient.class));
    }

    @Test
    @DisplayName("Should throw BusinessRuleException when admission date is in the future")
    void testFutureAdmissionDate() {
        CreatePatientRequestDto request = new CreatePatientRequestDto();
        request.setName("Future Person");
        request.setAge(25);
        request.setGender("Other");
        request.setWardId(1L);
        request.setDepartmentId(1L);
        request.setDoctorId(1L);
        request.setAdmissionDate(LocalDate.now().plusDays(2));

        when(wardRepository.findById(1L)).thenReturn(Optional.of(ward));
        when(departmentRepository.findById(1L)).thenReturn(Optional.of(deptCardio));
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(docCardio));

        assertThatThrownBy(() -> patientService.createPatient(request))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("Admission date cannot be in the future");

        verify(patientRepository, never()).save(any(Patient.class));
    }

    @Test
    @DisplayName("Should successfully update patient details")
    void testSuccessfulPatientUpdate() {
        Patient existing = new Patient();
        existing.setId(101L);
        existing.setPatientCode("PAT-1001");
        existing.setName("Old Name");
        existing.setAge(50);
        existing.setGender("Male");
        existing.setWard(ward);
        existing.setDepartment(deptCardio);
        existing.setDoctor(docCardio);
        existing.setAdmissionDate(LocalDate.now());
        existing.setStatus(PatientStatus.ADMITTED);

        UpdatePatientRequestDto updateReq = new UpdatePatientRequestDto();
        updateReq.setName("Updated Name");
        updateReq.setAge(51);
        updateReq.setGender("Male");
        updateReq.setWardId(1L);
        updateReq.setDepartmentId(1L);
        updateReq.setDoctorId(1L);
        updateReq.setAdmissionDate(LocalDate.now());
        updateReq.setStatus("ADMITTED");

        when(patientRepository.findById(101L)).thenReturn(Optional.of(existing));
        when(wardRepository.findById(1L)).thenReturn(Optional.of(ward));
        when(departmentRepository.findById(1L)).thenReturn(Optional.of(deptCardio));
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(docCardio));
        when(patientRepository.save(any(Patient.class))).thenAnswer(i -> i.getArgument(0));

        PatientResponseDto result = patientService.updatePatient(101L, updateReq);

        assertThat(result.getName()).isEqualTo("Updated Name");
        assertThat(result.getAge()).isEqualTo(51);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when updating non-existent patient")
    void testUpdatePatientNotFound() {
        UpdatePatientRequestDto updateReq = new UpdatePatientRequestDto();
        updateReq.setName("Unknown");
        updateReq.setAge(40);
        updateReq.setGender("Male");
        updateReq.setWardId(1L);
        updateReq.setDepartmentId(1L);
        updateReq.setDoctorId(1L);
        updateReq.setAdmissionDate(LocalDate.now());

        when(patientRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> patientService.updatePatient(999L, updateReq))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Patient not found with id: 999");
    }

    @Test
    @DisplayName("Should successfully discharge an admitted patient and preserve admission date")
    void testSuccessfulDischarge() {
        LocalDate admDate = LocalDate.now().minusDays(3);
        Patient patient = new Patient();
        patient.setId(101L);
        patient.setPatientCode("PAT-1001");
        patient.setName("Eleanor Vance");
        patient.setAge(54);
        patient.setGender("Female");
        patient.setWard(ward);
        patient.setDepartment(deptCardio);
        patient.setDoctor(docCardio);
        patient.setAdmissionDate(admDate);
        patient.setStatus(PatientStatus.ADMITTED);

        when(patientRepository.findById(101L)).thenReturn(Optional.of(patient));
        when(patientRepository.save(any(Patient.class))).thenAnswer(i -> i.getArgument(0));

        PatientResponseDto result = patientService.dischargePatient(101L);

        assertThat(result.getStatus()).isEqualTo("DISCHARGED");
        assertThat(result.getAdmissionDate()).isEqualTo(admDate);
    }

    @Test
    @DisplayName("Should throw IllegalStateException when attempting duplicate discharge")
    void testDuplicateDischarge() {
        Patient patient = new Patient();
        patient.setId(101L);
        patient.setPatientCode("PAT-1001");
        patient.setName("Eleanor Vance");
        patient.setAge(54);
        patient.setGender("Female");
        patient.setWard(ward);
        patient.setDepartment(deptCardio);
        patient.setDoctor(docCardio);
        patient.setAdmissionDate(LocalDate.now());
        patient.setStatus(PatientStatus.DISCHARGED);

        when(patientRepository.findById(101L)).thenReturn(Optional.of(patient));

        assertThatThrownBy(() -> patientService.dischargePatient(101L))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("already marked as DISCHARGED");

        verify(patientRepository, never()).save(any(Patient.class));
    }

    @Test
    @DisplayName("Should successfully delete a patient")
    void testSuccessfulDeletion() {
        Patient patient = new Patient();
        patient.setId(50L);
        when(patientRepository.findById(50L)).thenReturn(Optional.of(patient));

        patientService.deletePatient(50L);

        verify(patientRepository, times(1)).delete(patient);
    }
}
