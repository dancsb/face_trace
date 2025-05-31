#!/bin/bash

# Edit yaml file with: https://editor-next.swagger.io

JAR_FILE="swagger-codegen-cli-3.0.64.jar"

# Ellenőrzi, hogy létezik-e már a JAR fájl
if [ ! -f "$JAR_FILE" ]; then
    echo "Downloading $JAR_FILE..."
    wget https://repo1.maven.org/maven2/io/swagger/codegen/v3/swagger-codegen-cli/3.0.64/swagger-codegen-cli-3.0.64.jar
else
    echo "Using existing $JAR_FILE"
fi

java -jar swagger-codegen-cli-3.0.64.jar generate -i FaceTrace_api.yaml -l nodejs-server -o ./Backend
