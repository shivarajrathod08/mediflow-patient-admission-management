package com.mediflow.service;

import com.mediflow.dto.DepartmentDto;
import com.mediflow.dto.DoctorDto;
import com.mediflow.dto.WardDto;

import java.util.List;

public interface ReferenceDataService {
    List<DepartmentDto> getAllDepartments();
    List<WardDto> getAllWards();
    List<DoctorDto> getDoctors(Long departmentId);
}
