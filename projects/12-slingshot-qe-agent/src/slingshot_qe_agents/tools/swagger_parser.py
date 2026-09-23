"""Swagger/OpenAPI Parser Tool for SlingShot QE Agent."""

import json
from pathlib import Path
from typing import Any, Dict, List, Optional
import yaml


class SwaggerParserTool:
    """Tool to parse OpenAPI 2.0 / 3.0 and Swagger JSON/YAML specifications."""

    @staticmethod
    def load_spec(source: str) -> Dict[str, Any]:
        """Load OpenAPI spec from file path or raw string."""
        path = Path(source)
        if path.exists() and path.is_file():
            content = path.read_text(encoding="utf-8")
        else:
            content = source

        content_stripped = content.strip()
        if content_stripped.startswith("{") or content_stripped.startswith("["):
            return json.loads(content_stripped)
        return yaml.safe_load(content_stripped)

    @classmethod
    def extract_endpoints_summary(cls, spec_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Extract a clean, structured list of endpoints, methods, and parameters."""
        endpoints = []
        paths = spec_data.get("paths", {})
        base_url = spec_data.get("servers", [{}])[0].get("url", "") if "servers" in spec_data else spec_data.get("basePath", "")

        for path_str, path_item in paths.items():
            if not isinstance(path_item, dict):
                continue

            for method in ["get", "post", "put", "delete", "patch", "options", "head"]:
                if method in path_item:
                    op_data = path_item[method]
                    parameters = []

                    # Combine path-level and operation-level parameters
                    all_params = path_item.get("parameters", []) + op_data.get("parameters", [])
                    for param in all_params:
                        parameters.append({
                            "name": param.get("name"),
                            "in": param.get("in"),
                            "required": param.get("required", False),
                            "type": param.get("schema", {}).get("type") or param.get("type", "string"),
                            "description": param.get("description", "")
                        })

                    # Extract request body if OpenAPI 3.0
                    request_body_schema = None
                    if "requestBody" in op_data:
                        content_dict = op_data["requestBody"].get("content", {})
                        json_content = content_dict.get("application/json", {})
                        request_body_schema = json_content.get("schema", {})

                    # Extract responses
                    responses = {}
                    for code, resp in op_data.get("responses", {}).items():
                        responses[str(code)] = resp.get("description", "")

                    endpoints.append({
                        "path": path_str,
                        "method": method.upper(),
                        "summary": op_data.get("summary", ""),
                        "description": op_data.get("description", ""),
                        "operation_id": op_data.get("operationId", f"{method}_{path_str}"),
                        "parameters": parameters,
                        "request_body": request_body_schema,
                        "responses": responses,
                        "tags": op_data.get("tags", []),
                        "base_url": base_url
                    })

        return endpoints
