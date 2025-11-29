# Pandoc API

A simple RESTful server for converting documents using [pandoc](https://pandoc.org/)

## Install

[pandoc](https://pandoc.org/) is required for converting documents

```shell
# apt-get install pandoc
yarn add pandoc-api
```

## Usage

Start a server in command-line:

```shell
yarn start
```

Get command line help

```shell
yarn --help
```

```shell
pandoc-api, a simple RESTful server for converting documents
  please visit https://github.com/alphakevin/pandoc-api

usage: pandoc-api <command> <options>

commands:
  start [<hostname>[:<port>]]  start the server, default to localhost:4000
  help converter             get converter help

options:
  -h, --help                 print this help message
```

Use in your application

```javascript
import expores from 'express';
import pandoc from 'pandoc-api';

const app = express();
app.use('/pandoc', pandoc());
// ... your own express routes
app.listen(3000);
```

## Converter

The server provides a similar interface like pandoc, you can simply remove `--` or `-` and use `/`
instead of white-space between the arguments, all after `/api/convert`.

```http
POST /api/convert/from/<input-format>/to/<output-format> HTTP/1.1
```

You can upload file by either of the following method:

* `multipart/form-data` upload with a `file` field of the file to be converted.
* RAW upload a file in HTTP body with `Content-Type` and `Content-Disposition` header provided.

If the `/output/<value>` option is provided, the `Content-Disposition` header will contain the new filename.

The converted document will be directly output from the HTTP response body.

For more converting options, please visit [https://pandoc.org/MANUAL.html](https://pandoc.org/MANUAL.html#options)

## Environment Variables

| Name       | Description                   |
| ---------- | ----------------------------- |
| `HOSTNAME` | For server listening hostname |
| `PORT`     | For server listening port     |

## Template Management

The API provides endpoints to manage Pandoc templates for customizing document output. Templates allow you to control the final appearance of converted documents by defining custom headers, footers, layouts, and more.

### Template Storage

Templates are stored persistently in `${os.tmpdir()}/pandoc-api/templates/` organized by output format:
- `templates/html/` for HTML templates
- `templates/docx/` for DOCX templates
- `templates/pdf/` for PDF templates
- etc.

### List Templates

List all available templates or filter by format:

```shell
# List all templates
curl http://127.0.0.1:4000/api/templates

# Filter by format
curl http://127.0.0.1:4000/api/templates?format=html
```

**Response:**
```json
{
  "templates": [
    {
      "name": "custom-report",
      "format": "html",
      "size": 2048,
      "createdAt": "2025-11-28T10:30:00Z",
      "path": "/templates/html/custom-report.template"
    }
  ]
}
```

### Add Template

Upload a new template for a specific format:

```shell
# Add a template with custom name
curl -F file=@my-template.html http://127.0.0.1:4000/api/templates/html?name=custom

# Add a template using the original filename
curl -F file=@corporate-template.docx http://127.0.0.1:4000/api/templates/docx
```

**Response:**
```json
{
  "message": "Template added successfully",
  "template": {
    "name": "custom",
    "format": "html",
    "size": 2048,
    "createdAt": "2025-11-28T10:30:00Z",
    "path": "/templates/html/custom.template"
  }
}
```

### Delete Template

Remove an existing template:

```shell
curl -X DELETE http://127.0.0.1:4000/api/templates/html/custom
```

**Response:**
```json
{
  "message": "Template deleted successfully",
  "template": {
    "name": "custom",
    "format": "html"
  }
}
```

### Error Responses

The API returns appropriate error codes:
- **400 Bad Request**: Invalid format or missing file
- **404 Not Found**: Template not found
- **409 Conflict**: Template with the same name already exists

**Example error:**
```json
{
  "status": 404,
  "code": "template_not_found",
  "message": "Template 'custom' not found for format 'html'"
}
```

### Using Templates in Conversion

To use a template during document conversion, add the `template` option to your conversion request:

```shell
curl -F file=@document.md \
  http://127.0.0.1:4000/api/convert/from/markdown/to/html/template/custom > output.html
```

For more information about creating Pandoc templates, visit the [Pandoc Templates Documentation](https://pandoc.org/MANUAL.html#templates).

## Examples

Visit `http://127.0.0.1:4000/help`, or get help in command-line:

```shell
yarn cli help converter
```

Here we use cURL for examples.

### Uploading with `multipart/form-data`

```shell
$ curl -F file=@example.docx http://127.0.0.1:4000/api/convert/from/docx/to/html > result.html
```

### Uploading RAW Binary Data

```shell
$ curl -X POST \
  -T "example.docx" \
  -H "Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document" \
  -H "Content-Disposition: attachment; filename="example.docx"" \
  http://127.0.0.1:4000/api/convert/from/docx/to/html > result.html
```

### Converting Options

```shell
  /e, /export/<value>     set export filter options
  /f, /format/<value>     specify the output format
  /F, /field/<value>      replace user-defined text field with value
  /i, /import/<value>     set import filter option string
  /o, /output/<value>     output basename, filename or directory
      /password/<value>   provide a password to decrypt the document
```

## Run as Docker Container

`pandoc-api` can start from docker without source code or npm installed:

```shell
docker run -d -p 4000:4000 --name=pandoc --restart=always alphakevin/pandoc-api
```

## Notice

* This is a simple http server and supposed to run as inner micro-service, so it does not include any authorization method. Please take your own risk to deploy it publicly.
* Document formats and options are not fully tested, it just pass them to pandoc.

## License

MIT
