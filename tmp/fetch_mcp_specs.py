#!/usr/bin/env python3
"""
Simple SSE client to fetch MCP specs from local eqp-parameter-spec-api /mcp/ endpoint.
Usage: python3 tmp/fetch_mcp_specs.py
"""
import requests
import sseclient

BASE = "http://127.0.0.1:5001"

# Step 1: get session id by requesting with JSON accept
r = requests.get(BASE + "/mcp/", headers={"Accept": "application/json"})
print("status:", r.status_code)
print(r.text)

session_id = r.headers.get("mcp-session-id")
if not session_id:
    print("No mcp-session-id returned")
    raise SystemExit(1)

print("session_id:", session_id)

# Step 2: open SSE stream
headers = {"Accept": "text/event-stream", "mcp-session-id": session_id}
with requests.get(BASE + "/mcp/", stream=True, headers=headers) as resp:
    if resp.status_code != 200:
        print("SSE request failed status:", resp.status_code)
        print(resp.text)
        raise SystemExit(1)
    client = sseclient.SSEClient(resp)
    for i, event in enumerate(client.events()):
        print("event:", event)
        if i > 50:
            break
