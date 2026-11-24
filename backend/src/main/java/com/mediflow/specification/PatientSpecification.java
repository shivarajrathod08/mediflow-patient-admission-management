package com.mediflow.specification;

import com.mediflow.entity.Patient;
import com.mediflow.entity.PatientStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class PatientSpecification {

    public static Specification<Patient> withFilters(
            String search,
            Long wardId,
            Long departmentId,
            Long doctorId,
            PatientStatus status) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.trim().isEmpty()) {
                String term = "%" + search.trim().toLowerCase() + "%";
                Predicate nameMatch = cb.like(cb.lower(root.get("name")), term);
                Predicate codeMatch = cb.like(cb.lower(root.get("patientCode")), term);
                predicates.add(cb.or(nameMatch, codeMatch));
            }

            if (wardId != null) {
                predicates.add(cb.equal(root.get("ward").get("id"), wardId));
            }

            if (departmentId != null) {
                predicates.add(cb.equal(root.get("department").get("id"), departmentId));
            }

            if (doctorId != null) {
                predicates.add(cb.equal(root.get("doctor").get("id"), doctorId));
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
