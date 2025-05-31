# Edit yaml file with: https://editor-next.swagger.io

$jarFile = "swagger-codegen-cli-3.0.64.jar"

if (-not(Test-Path -Path $jarFile -PathType Leaf)) {
    Write-Host "Downloading $jarFile..."
    $url = "https://repo1.maven.org/maven2/io/swagger/codegen/v3/swagger-codegen-cli/3.0.64/$jarFile"
    Invoke-WebRequest -Uri $url -OutFile $jarFile
} else {
    Write-Host "Using existing $jarFile"
}

java -jar swagger-codegen-cli-3.0.64.jar generate -i FaceTrace_api.yaml -l nodejs-server -o ./Backend
