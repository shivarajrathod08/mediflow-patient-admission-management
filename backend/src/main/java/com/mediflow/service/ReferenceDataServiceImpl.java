package com.mediflow.service;

import com.mediflow.dto.DepartmentDto;
import com.mediflow.dto.DoctorDto;
import com.mediflow.dto.WardDto;
import com.mediflow.entity.Department;
import com.mediflow.entity.Doctor;
import com.mediflow.entity.Ward;
import com.mediflow.repository.DepartmentRepository;
import com.mediflow.repository.DoctorRepository;
import com.mediflow.repository.WardRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ReferenceDataServiceImpl implements ReferenceDataService {

    private final DepartmentRepository departmentRepository;
    private final WardRepository wardRepository;
    private final DoctorRepository doctorRepository;

    public ReferenceDataServiceImpl(DepartmentRepository departmentRepository,
                                    WardRepository wardRepository,
                                    DoctorRepository doctorRepository) {
        this.departmentRepository = departmentRepository;
        this.wardRepository = wardRepository;
        this.doctorRepository = doctorRepository;
    }

    @Override
    public List<DepartmentDto> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::mapToDepartmentDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<WardDto> getAllWards() {
        return wardRepository.findAll().stream()
                .map(this::mapToWardDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DoctorDto> getDoctors(Long departmentId) {
        List<Doctor> doctors;
        if (departmentId != null) {
            doctors = doctorRepository.findByDepartmentId(departmentId);
        } else {
            doctors = doctorRepository.findAll();
        }
        return doctors.stream()
                .map(this::mapToDoctorDto)
                .collect(Collectors.toList());
    }

    private DepartmentDto mapToDepartmentDto(Department d) {
        return new DepartmentDto(d.getId(), d.getName(), d.getCode());
    }

    private WardDto mapToWardDto(Ward w) {
        return new WardDto(w.getId(), w.getName(), w.getCode(), w.getCapacity());
    }

    private DoctorDto mapToDoctorDto(Doctor doc) {
        return new DoctorDto(
                doc.getId(),
                doc.getName(),
                doc.getDepartment().getId(),
                doc.getDepartment().getName(),
                doc.getSpecialization()
        );
    }
}
