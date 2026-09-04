# ---------- BUILD STAGE ----------
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests=true


# ---------- RUNTIME STAGE ----------
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Copy JAR from build stage
COPY --from=build /app/target/Fintrack-0.0.1-SNAPSHOT.jar app.jar

# Expose application port
EXPOSE 8081

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
