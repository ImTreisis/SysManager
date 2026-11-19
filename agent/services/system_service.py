import os

import psutil


def get_cpu_info():
    """Return a short CPU sample and the number of logical CPU cores."""
    return {
        "percent": psutil.cpu_percent(interval=0.1),
        "logical_cores": psutil.cpu_count(logical=True),
    }


def get_memory_info():
    """Return physical memory values in bytes and the usage percentage."""
    memory = psutil.virtual_memory()
    return {
        "total_bytes": memory.total,
        "available_bytes": memory.available,
        "used_bytes": memory.used,
        "percent": memory.percent,
    }


def get_disk_info():
    """Return usage for the Windows drive where the operating system lives."""
    system_drive = os.environ.get("SystemDrive", "C:")
    drive_path = system_drive + "\\"
    disk = psutil.disk_usage(drive_path)
    return {
        "path": drive_path,
        "total_bytes": disk.total,
        "used_bytes": disk.used,
        "free_bytes": disk.free,
        "percent": disk.percent,
    }


def get_network_info():
    """Return cumulative network traffic counters since the computer started."""
    counters = psutil.net_io_counters()
    if counters is None:
        return {"available": False}

    return {
        "available": True,
        "bytes_sent": counters.bytes_sent,
        "bytes_received": counters.bytes_recv,
        "packets_sent": counters.packets_sent,
        "packets_received": counters.packets_recv,
        "errors_in": counters.errin,
        "errors_out": counters.errout,
    }
