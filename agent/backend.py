import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from services.process_service import get_processes
from services.system_service import (
    get_cpu_info,
    get_disk_info,
    get_memory_info,
    get_network_info,
)


app = FastAPI(title="Windows System Monitor Agent")

allowed_origins = os.environ.get(
    "WINDOWS_MONITOR_ALLOWED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in allowed_origins.split(",") if origin.strip()],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["Accept"],
)


@app.get("/api/status")
def get_status():
    """Report whether the local monitoring agent is responding."""
    return {"status": "online", "service": "windows-system-monitor-agent"}


@app.get("/api/system/cpu")
def read_cpu():
    return get_cpu_info()


@app.get("/api/system/memory")
def read_memory():
    return get_memory_info()


@app.get("/api/system/disk")
def read_disk():
    return get_disk_info()


@app.get("/api/system/network")
def read_network():
    return get_network_info()


@app.get("/api/processes")
def read_processes():
    return get_processes()
