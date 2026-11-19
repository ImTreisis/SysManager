import psutil


def get_processes():
    """Return basic CPU and memory details for currently running processes."""
    processes = []

    for process in psutil.process_iter(
        ["pid", "name", "cpu_percent", "memory_info", "memory_percent"],
        ad_value=None,
    ):
        info = process.info
        memory_info = info["memory_info"]
        processes.append(
            {
                "pid": info["pid"],
                "name": info["name"] or "Unknown",
                "cpu_percent": info["cpu_percent"] or 0.0,
                "memory_bytes": memory_info.rss if memory_info else None,
                "memory_percent": info["memory_percent"],
            }
        )

    return sorted(processes, key=lambda process: process["cpu_percent"], reverse=True)
