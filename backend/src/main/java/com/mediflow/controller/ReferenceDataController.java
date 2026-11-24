package com.mediflow.controller;

import com.mediflow.dto.ApiResponse;
import com.mediflow.dto.DepartmentDto;
import com.mediflow.dto.DoctorDto;
import com.mediflow.dto.WardDto;
import com.mediflow.service.ReferenceDataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ReferenceDataController {

    private final ReferenceDataService referenceDataService;

    public ReferenceDataController(ReferenceDataService referenceDataService) {
        this.referenceDataService = referenceDataService;
    }

    @GetMapping("/departments")
    public ResponseEntity<ApiResponse<List<DepartmentDto>>> getDepartments() {
        return ResponseEntity.ok(ApiResponse.success(referenceDataService.getAllDepartments()));
    }

    @GetMapping("/wards")
    public ResponseEntity<ApiResponse<List<WardDto>>> getWards() {
        return ResponseEntity.ok(ApiResponse.success(referenceDataService.getAllWards()));
    }

    @GetMapping("/doctors")
    public ResponseEntity<ApiResponse<List<DoctorDto>>> getDoctors(@RequestParam(required = false) Long departmentId) {
        return ResponseEntity.ok(ApiResponse.success(referenceDataService.getDoctors(departmentId)));
    }
}
