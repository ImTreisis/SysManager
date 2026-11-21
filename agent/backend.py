import os

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from starlette.middleware.trustedhost import TrustedHostMiddleware

from services.gpu_service import get_gpu_info
from services.process_control import ProcessControlError, terminate_process
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
allowed_origin_list = [origin.strip() for origin in allowed_origins.split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origin_list,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Accept", "Content-Type"],
)
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["127.0.0.1", "localhost"])


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


@app.get("/api/system/gpu")
def read_gpu():
    return get_gpu_info()


@app.get("/api/processes")
def read_processes():
    return get_processes()


class TerminateProcessRequest(BaseModel):
    name: str = Field(min_length=1, max_length=260)
    create_time: float = Field(allow_inf_nan=False)


@app.post("/api/processes/{pid}/terminate")
def stop_process(pid: int, body: TerminateProcessRequest, request: Request):
    """Stop a selected process only when the request comes from an allowed website origin."""
    origin = request.headers.get("origin")
    if origin not in allowed_origin_list:
        raise HTTPException(status_code=403, detail="This website origin is not allowed to control processes.")

    try:
        return terminate_process(pid, body.name, body.create_time)
    except ProcessControlError as error:
        raise HTTPException(status_code=error.status_code, detail=str(error)) from error
