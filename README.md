# 📄 Resume Reviewer API (IA Powered)

API RESTful desarrollada con **Java** y **Spring Boot** que integra la API de **Google Gemini AI** para analizar y evaluar la compatibilidad de currículums (CV) frente a descripciones de puestos de trabajo.

## 🚀 Tecnologías Utilizadas

- **Java 17 / 21**
- **Spring Boot 3**
- **Spring Data JPA**
- **MySQL Database**
- **Google Gemini AI (SDK/Rest API)**
- **Lombok**
- **Maven**

## 🛠️ Arquitectura y Características

- **Diseño de API REST:** Endpoints estructurados bajo estándares HTTP (`GET`, `POST`, `DELETE`).
- **Integración con Inteligencia Artificial:** Prompt Engineering optimizado para recibir un CV y una oferta de empleo, devolviendo una puntuación de compatibilidad y feedback constructivo.
- **Manejo Global de Excepciones:** Respuestas HTTP estructuradas (`404 Not Found`, `500 Internal Server Error`) mediante `@RestControllerAdvice`.
- **Persistencia de Datos:** Almacenamiento del historial de revisiones en MySQL.

## 📌 Endpoints de la API

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `POST` | `/api/v1/reviews/analyze` | Analiza un CV frente a una oferta y guarda el resultado. |
| `GET` | `/api/v1/reviews` | Obtiene el historial de todos los análisis realizados. |
| `GET` | `/api/v1/reviews/{id}` | Obtiene el detalle de una revisión específica por ID. |
| `DELETE` | `/api/v1/reviews/{id}` | Elimina un registro de análisis por ID. |

## ⚙️ Configuración del Entorno

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Alvaroms117/resume-reviewer-api.git