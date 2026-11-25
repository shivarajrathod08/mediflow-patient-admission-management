package com.mediflow.controller;

import com.mediflow.dto.DashboardSummaryDto;
import com.mediflow.service.DashboardService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = DashboardController.class)
class DashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DashboardService dashboardService;

    private DashboardSummaryDto createSampleSummary() {
        return new DashboardSummaryDto(
                10L, 8L, 2L, 1L,
                Collections.emptyList(),
                Collections.emptyList(),
                Collections.emptyList()
        );
    }

    @Test
    @DisplayName("GET /api/dashboard/summary should return HTTP 200 with summary data")
    void shouldReturnSummaryOnPrimaryApiRoute() throws Exception {
        when(dashboardService.getDashboardSummary()).thenReturn(createSampleSummary());

        mockMvc.perform(get("/api/dashboard/summary")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalPatients").value(10))
                .andExpect(jsonPath("$.data.admittedPatients").value(8));
    }

    @Test
    @DisplayName("GET /dashboard/summary should return HTTP 200 with summary data")
    void shouldReturnSummaryOnDashboardSummaryRoute() throws Exception {
        when(dashboardService.getDashboardSummary()).thenReturn(createSampleSummary());

        mockMvc.perform(get("/dashboard/summary")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalPatients").value(10));
    }

    @Test
    @DisplayName("GET /summary should return HTTP 200 with summary data")
    void shouldReturnSummaryOnRootSummaryRoute() throws Exception {
        when(dashboardService.getDashboardSummary()).thenReturn(createSampleSummary());

        mockMvc.perform(get("/summary")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalPatients").value(10));
    }

    @Test
    @DisplayName("GET non-existent endpoint should return HTTP 404 NOT FOUND instead of 500")
    void shouldReturn404OnUnknownEndpoint() throws Exception {
        mockMvc.perform(get("/api/non-existent-endpoint")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }
}
