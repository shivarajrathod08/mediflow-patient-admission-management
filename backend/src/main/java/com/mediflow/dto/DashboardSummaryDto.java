package com.mediflow.dto;

import java.util.List;

public class DashboardSummaryDto {
    private long totalPatients;
    private long admittedPatients;
    private long dischargedPatients;
    private long admissionsToday;
    private List<DepartmentStatDto> departmentDistribution;
    private List<WardOccupancyDto> wardOccupancy;
    private List<PatientResponseDto> recentAdmissions;

    public DashboardSummaryDto() {
    }

    public DashboardSummaryDto(long totalPatients, long admittedPatients, long dischargedPatients, long admissionsToday,
                               List<DepartmentStatDto> departmentDistribution, List<WardOccupancyDto> wardOccupancy,
                               List<PatientResponseDto> recentAdmissions) {
        this.totalPatients = totalPatients;
        this.admittedPatients = admittedPatients;
        this.dischargedPatients = dischargedPatients;
        this.admissionsToday = admissionsToday;
        this.departmentDistribution = departmentDistribution;
        this.wardOccupancy = wardOccupancy;
        this.recentAdmissions = recentAdmissions;
    }

    public long getTotalPatients() {
        return totalPatients;
    }

    public void setTotalPatients(long totalPatients) {
        this.totalPatients = totalPatients;
    }

    public long getAdmittedPatients() {
        return admittedPatients;
    }

    public void setAdmittedPatients(long admittedPatients) {
        this.admittedPatients = admittedPatients;
    }

    public long getDischargedPatients() {
        return dischargedPatients;
    }

    public void setDischargedPatients(long dischargedPatients) {
        this.dischargedPatients = dischargedPatients;
    }

    public long getAdmissionsToday() {
        return admissionsToday;
    }

    public void setAdmissionsToday(long admissionsToday) {
        this.admissionsToday = admissionsToday;
    }

    public List<DepartmentStatDto> getDepartmentDistribution() {
        return departmentDistribution;
    }

    public void setDepartmentDistribution(List<DepartmentStatDto> departmentDistribution) {
        this.departmentDistribution = departmentDistribution;
    }

    public List<WardOccupancyDto> getWardOccupancy() {
        return wardOccupancy;
    }

    public void setWardOccupancy(List<WardOccupancyDto> wardOccupancy) {
        this.wardOccupancy = wardOccupancy;
    }

    public List<PatientResponseDto> getRecentAdmissions() {
        return recentAdmissions;
    }

    public void setRecentAdmissions(List<PatientResponseDto> recentAdmissions) {
        this.recentAdmissions = recentAdmissions;
    }

    public static class DepartmentStatDto {
        private Long departmentId;
        private String departmentName;
        private long patientCount;
        private double percentage;

        public DepartmentStatDto() {
        }

        public DepartmentStatDto(Long departmentId, String departmentName, long patientCount, double percentage) {
            this.departmentId = departmentId;
            this.departmentName = departmentName;
            this.patientCount = patientCount;
            this.percentage = percentage;
        }

        public Long getDepartmentId() {
            return departmentId;
        }

        public void setDepartmentId(Long departmentId) {
            this.departmentId = departmentId;
        }

        public String getDepartmentName() {
            return departmentName;
        }

        public void setDepartmentName(String departmentName) {
            this.departmentName = departmentName;
        }

        public long getPatientCount() {
            return patientCount;
        }

        public void setPatientCount(long patientCount) {
            this.patientCount = patientCount;
        }

        public double getPercentage() {
            return percentage;
        }

        public void setPercentage(double percentage) {
            this.percentage = percentage;
        }
    }

    public static class WardOccupancyDto {
        private Long wardId;
        private String wardName;
        private long admittedCount;
        private int totalCapacity;
        private double occupancyRate;

        public WardOccupancyDto() {
        }

        public WardOccupancyDto(Long wardId, String wardName, long admittedCount, int totalCapacity, double occupancyRate) {
            this.wardId = wardId;
            this.wardName = wardName;
            this.admittedCount = admittedCount;
            this.totalCapacity = totalCapacity;
            this.occupancyRate = occupancyRate;
        }

        public Long getWardId() {
            return wardId;
        }

        public void setWardId(Long wardId) {
            this.wardId = wardId;
        }

        public String getWardName() {
            return wardName;
        }

        public void setWardName(String wardName) {
            this.wardName = wardName;
        }

        public long getAdmittedCount() {
            return admittedCount;
        }

        public void setAdmittedCount(long admittedCount) {
            this.admittedCount = admittedCount;
        }

        public int getTotalCapacity() {
            return totalCapacity;
        }

        public void setTotalCapacity(int totalCapacity) {
            this.totalCapacity = totalCapacity;
        }

        public double getOccupancyRate() {
            return occupancyRate;
        }

        public void setOccupancyRate(double occupancyRate) {
            this.occupancyRate = occupancyRate;
        }
    }
}
