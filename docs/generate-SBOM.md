## Generación del SBOM con Snyk

Se generó un archivo SBOM (Software Bill of Materials) con el comando:

```bash
npx snyk sbom --format=cyclonedx1.4+json > sbom/sbom-cyclonedx.json

```
El resultado se exportó en formato CycloneDX 1.4 JSON, mostrando todas las dependencias del proyecto junto con sus versiones y licencias detectadas automáticamente por Snyk.
