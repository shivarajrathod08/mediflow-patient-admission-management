package com.mediflow.repository;

import com.mediflow.entity.Patient;
import com.mediflow.entity.PatientStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long>, JpaSpecificationExecutor<Patient> {

    long countByStatus(PatientStatus status);

    long countByAdmissionDate(LocalDate admissionDate);

    List<Patient> findTop5ByOrderByCreatedAtDesc();

    @Query("SELECT p FROM Patient p WHERE " +
           "(:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')) OR LOWER(p.patientCode) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:wardId IS NULL OR p.ward.id = :wardId) AND " +
           "(:departmentId IS NULL OR p.department.id = :departmentId) AND " +
           "(:doctorId IS NULL OR p.doctor.id = :doctorId) AND " +
           "(:status IS NULL OR p.status = :status)")
    Page<Patient> findWithFilters(@Param("name") String name,
                                  @Param("wardId") Long wardId,
                                  @Param("departmentId") Long departmentId,
                                  @Param("doctorId") Long doctorId,
                                  @Param("status") PatientStatus status,
                                  Pageable pageable);

    @Query("SELECT p.department.id, p.department.name, COUNT(p) FROM Patient p GROUP BY p.department.id, p.department.name")
    List<Object[]> countPatientsByDepartment();

    @Query("SELECT p.ward.id, p.ward.name, p.ward.capacity, COUNT(p) FROM Patient p WHERE p.status = 'ADMITTED' GROUP BY p.ward.id, p.ward.name, p.ward.capacity")
    List<Object[]> countAdmittedPatientsByWard();

    @Query("SELECT MAX(p.id) FROM Patient p")
    Long findMaxId();
}
