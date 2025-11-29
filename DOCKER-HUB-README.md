# Pandoc API - Docker Image

![Docker Pulls](https://img.shields.io/docker/pulls/rderet/pandoc-api)
![Docker Image Size](https://img.shields.io/docker/image-size/rderet/pandoc-api/latest)
![License](https://img.shields.io/github/license/alphakevin/pandoc-api)

A production-ready RESTful API server for document conversion using [Pandoc](https://pandoc.org/). Convert between Markdown, HTML, DOCX, PDF, LaTeX, and 40+ other document formats with custom template support.

## 🚀 Quick Start

### Basic Usage

```bash
# Run the container
docker run -d \
  -p 4000:4000 \
  --name pandoc-api \
  rderet/pandoc-api:latest

# Test the API
curl -F file=@document.md \
  http://localhost:4000/api/convert/from/markdown/to/html \
  -o output.html
```

### With Docker Compose

```yaml
version: '3.8'

services:
  pandoc-api:
    image: rderet/pandoc-api:latest
    container_name: pandoc-api
    ports:
      - "4000:4000"
    environment:
      - HOSTNAME=0.0.0.0
      - PORT=4000
    volumes:
      - ./templates:/templates:ro
    restart: unless-stopped
```

## 📋 Features

✅ **40+ Format Support** - Convert between Markdown, HTML, DOCX, PDF, LaTeX, EPUB, ODT, and more  
✅ **Custom Templates** - Use your own Pandoc templates for branded documents  
✅ **RESTful API** - Simple HTTP endpoints for easy integration  
✅ **Template Management** - Built-in API to manage and list templates  
✅ **Reference Documents** - Support for DOCX reference documents (styles, headers, footers)  
✅ **Production Ready** - Alpine-based image with health checks  
✅ **Persistent Storage** - Template and temporary file persistence via volumes

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `HOSTNAME` | `0.0.0.0` | Server listening hostname |
| `PORT` | `4000` | Server listening port |
| `TEMPLATES_DIR` | `/templates` | Directory for custom templates |

### Volume Mounts

```bash
docker run -d \
  -p 4000:4000 \
  -v /path/to/templates:/templates:ro \
  -v /path/to/tmp:/tmp \
  rderet/pandoc-api:latest
```

- `/templates` - Store custom Pandoc templates (read-only recommended)
- `/tmp` - Temporary files for conversions (read-write)

## 📖 API Usage

### Convert Documents

```bash
# Markdown to HTML
curl -F file=@document.md \
  http://localhost:4000/api/convert/from/markdown/to/html \
  -o output.html

# Markdown to DOCX
curl -F file=@document.md \
  http://localhost:4000/api/convert/from/markdown/to/docx \
  -o output.docx

# Markdown to PDF
curl -F file=@document.md \
  http://localhost:4000/api/convert/from/markdown/to/pdf \
  -o output.pdf

# HTML to DOCX with custom template
curl -F file=@document.html \
  "http://localhost:4000/api/convert/from/html/to/docx/reference-doc/%2Ftemplates%2Fcorporate.dotx" \
  -o output.docx
```

### Template Management API

```bash
# List all templates
curl http://localhost:4000/api/templates

# List templates by format
curl http://localhost:4000/api/templates?format=html

# Upload a template
curl -F file=@my-template.html \
  http://localhost:4000/api/templates/html?name=corporate

# Delete a template
curl -X DELETE \
  http://localhost:4000/api/templates/html/corporate
```

### Supported Formats

**Input formats**: markdown, html, docx, latex, epub, rst, textile, mediawiki, org, and more  
**Output formats**: html, docx, pdf, latex, epub, odt, rtf, asciidoc, and more

For the complete list, see [Pandoc documentation](https://pandoc.org/MANUAL.html#general-options).

## 🔒 Production Deployment

### With Template Persistence

```yaml
version: '3.8'

services:
  pandoc-api:
    image: rderet/pandoc-api:2025-11-28-1
    container_name: pandoc-api
    restart: unless-stopped
    ports:
      - "4000:4000"
    environment:
      - HOSTNAME=0.0.0.0
      - PORT=4000
      - NODE_ENV=production
    volumes:
      - /data/pandoc/templates:/templates:rw
      - /data/pandoc/tmp:/tmp:rw
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:4000/api/help"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
    networks:
      - pandoc-network

networks:
  pandoc-network:
    driver: bridge
```

### Behind a Reverse Proxy (Nginx)

```nginx
location /pandoc/ {
    proxy_pass http://pandoc-api:4000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # Increase timeouts for large file conversions
    proxy_read_timeout 300s;
    proxy_connect_timeout 300s;
    proxy_send_timeout 300s;
    
    # Increase max body size for file uploads
    client_max_body_size 50M;
}
```

## 💡 Examples

### JavaScript/Node.js

```javascript
const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

async function convertDocument(inputPath, fromFormat, toFormat) {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(inputPath));
  
  const response = await fetch(
    `http://localhost:4000/api/convert/from/${fromFormat}/to/${toFormat}`,
    {
      method: 'POST',
      body: formData
    }
  );
  
  return await response.buffer();
}

// Usage
const docx = await convertDocument('./report.md', 'markdown', 'docx');
fs.writeFileSync('./report.docx', docx);
```

### Python

```python
import requests

def convert_document(input_path, from_format, to_format):
    with open(input_path, 'rb') as f:
        files = {'file': f}
        response = requests.post(
            f'http://localhost:4000/api/convert/from/{from_format}/to/{to_format}',
            files=files
        )
    
    response.raise_for_status()
    return response.content

# Usage
docx = convert_document('./report.md', 'markdown', 'docx')
with open('./report.docx', 'wb') as f:
    f.write(docx)
```

### cURL with Custom Options

```bash
# Convert with table of contents
curl -F file=@document.md \
  "http://localhost:4000/api/convert/from/markdown/to/html/toc" \
  -o output.html

# Convert with specific output filename
curl -F file=@document.md \
  "http://localhost:4000/api/convert/from/markdown/to/docx/output/my-report.docx" \
  -o output.docx
```

## 🏷️ Tags & Versions

- `latest` - Latest stable version
- `2025-11-28-1` - Specific dated version with template management support
- `2025-11-27` - Previous version with reference-doc support

We recommend using specific version tags for production deployments.

## 🔨 Building from Source

```bash
# Clone the repository
git clone https://github.com/alphakevin/pandoc-api.git
cd pandoc-api

# Build the image
docker build -t pandoc-api:custom .

# Run your custom build
docker run -d -p 4000:4000 pandoc-api:custom
```

## 🐛 Troubleshooting

### Container won't start

Check logs:
```bash
docker logs pandoc-api
```

### Template not found

Ensure the template directory is correctly mounted and templates exist:
```bash
docker exec pandoc-api ls -la /templates
```

### Large file conversions timeout

Increase proxy timeouts or adjust Docker resource limits:
```yaml
deploy:
  resources:
    limits:
      memory: 2G
      cpus: '2'
```

## 📚 Documentation

- **Full API Documentation**: [GitHub Repository](https://github.com/alphakevin/pandoc-api)
- **Template Management Guide**: [Template Management](https://github.com/alphakevin/pandoc-api/tree/master/docs)
- **Pandoc Manual**: [pandoc.org/MANUAL.html](https://pandoc.org/MANUAL.html)

## 📄 License

MIT License - see [LICENSE](https://github.com/alphakevin/pandoc-api/blob/master/LICENSE)

## 🤝 Contributing

Contributions are welcome! Please visit the [GitHub repository](https://github.com/alphakevin/pandoc-api) to report issues or submit pull requests.

## 🔗 Links

- **GitHub**: [alphakevin/pandoc-api](https://github.com/alphakevin/pandoc-api)
- **Docker Hub**: [rderet/pandoc-api](https://hub.docker.com/r/rderet/pandoc-api)
- **Pandoc**: [pandoc.org](https://pandoc.org/)

---

**Maintained by**: rderet  
**Based on**: [alphakevin/pandoc-api](https://github.com/alphakevin/pandoc-api)  
**Base Image**: pandoc/core (Alpine Linux)