package com.resumereviewer.resume_reviewer_api.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class AiAnalysisService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestClient restClient;

    public AiAnalysisService() {
        // Configuramos timeouts para evitar que la petición se quede colgada
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(5000);  // 5 segundos máximo para conectar
        requestFactory.setReadTimeout(10000);    // 10 segundos máximo para recibir respuesta

        this.restClient = RestClient.builder()
                .requestFactory(requestFactory)
                .build();
    }

    public String analyzeResume(String jobDescription, String resumeText) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=" + apiKey;

        String prompt = """
            Eres un reclutador experto en tecnología.
            Analiza la coincidencia entre la siguiente Oferta de Empleo y el Currículum.
            
            OFERTA DE EMPLEO:
            %s
            
            CURRÍCULUM:
            %s
            
            Instrucciones de respuesta:
            1. Proporciona una puntuación de coincidencia del 0 al 100 en la primera línea en este formato exacto: "PUNTUACION: 75"
            2. En las siguientes líneas, enumera los puntos fuertes del candidato y 2 o 3 consejos concretos para mejorar el CV de cara a esta oferta.
            """.formatted(jobDescription, resumeText);

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt)
                        ))
                )
        );

        try {
            Map response = restClient.post()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(Map.class);

            List candidates = (List) response.get("candidates");
            Map firstCandidate = (Map) candidates.get(0);
            Map content = (Map) firstCandidate.get("content");
            List parts = (List) content.get("parts");
            Map firstPart = (Map) parts.get(0);

            return (String) firstPart.get("text");

        } catch (Exception e) {
            return "PUNTUACION: 50\nError al conectar con la IA de Gemini: " + e.getMessage();
        }
    }
}