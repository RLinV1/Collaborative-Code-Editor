package com.example.codeeditorbackend.service;

import com.example.codeeditorbackend.dto.CodeRunnerRequest;
import com.example.codeeditorbackend.dto.PistonResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CodeRunnerService {

    public String getRuntimeCode() {
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.getForObject("https://emkc.org/api/v2/piston/runtimes", String.class);
    }

    public String executeCode(CodeRunnerRequest request) {
        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> pistonRequest = new HashMap<>();
        pistonRequest.put("language", request.getLanguage());
        pistonRequest.put("version", "*");  // * means latest version
        pistonRequest.put("files", List.of(
                Map.of(
                        "name", request.getFiles().get(0).get("name"),
                        "content", request.getFiles().get(0).get("content")
                )

        ));

        PistonResponse response = restTemplate.postForObject(
                "https://emkc.org/api/v2/piston/execute",
                pistonRequest,
                PistonResponse.class
        );
        System.out.println(response);

        if (response == null || response.getRun() == null) {
            return "Error executing code";
        }
        // Extract output
        String output = response.getRun().getStdout();
        String error = response.getRun().getStderr();

        if (error != null && !error.isEmpty()) return error;


        return output != null ? output : "No output";

    }
}
