#!/usr/bin/env python3
"""
Class Bunker - Local Development & Production Server
Lightweight, zero-dependency static server with MIME type handling and auto-browser opening.
"""

import http.server
import socketserver
import os
import sys
import webbrowser

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class ClassBunkerHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable CORS and caching headers for local testing
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def run_server():
    os.chdir(DIRECTORY)
    socketserver.TCPServer.allow_reuse_address = True
    port = PORT
    for attempt in range(5):
        try:
            httpd = socketserver.TCPServer(("", port), ClassBunkerHandler)
            break
        except OSError:
            port += 1
    
    url = f"http://localhost:{port}"
    print("=" * 60)
    print("Class Bunker - Universal Attendance Planning App")
    print("Tagline: Bunk smart. Stay eligible.")
    print(f"Serving locally at: {url}")
    print("Press Ctrl+C to stop the server.")
    print("=" * 60)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down Class Bunker server...")
        httpd.shutdown()

if __name__ == '__main__':
    run_server()
