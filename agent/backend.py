from fastapi import FastAPI


app = FastAPI(title="Windows System Monitor Agent")


@app.get("/api/status")
def get_status():
    """Report whether the local monitoring agent is responding."""
    return {"status": "online", "service": "windows-system-monitor-agent"}
