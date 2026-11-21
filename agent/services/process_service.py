import ctypes
import os
from ctypes import wintypes

import psutil


def get_visible_window_process_ids():
    """Return PIDs that own a visible Windows window with a title."""
    if os.name != "nt":
        return set()

    user32 = ctypes.WinDLL("user32", use_last_error=True)
    visible_process_ids = set()

    user32.IsWindowVisible.argtypes = [wintypes.HWND]
    user32.IsWindowVisible.restype = wintypes.BOOL
    user32.GetWindowTextLengthW.argtypes = [wintypes.HWND]
    user32.GetWindowTextLengthW.restype = ctypes.c_int
    user32.GetWindowThreadProcessId.argtypes = [wintypes.HWND, ctypes.POINTER(wintypes.DWORD)]
    user32.GetWindowThreadProcessId.restype = wintypes.DWORD

    callback_type = ctypes.WINFUNCTYPE(wintypes.BOOL, wintypes.HWND, wintypes.LPARAM)

    def collect_window_process_id(window_handle, _):
        if user32.IsWindowVisible(window_handle) and user32.GetWindowTextLengthW(window_handle) > 0:
            process_id = wintypes.DWORD()
            user32.GetWindowThreadProcessId(window_handle, ctypes.byref(process_id))
            if process_id.value:
                visible_process_ids.add(process_id.value)
        return True

    callback = callback_type(collect_window_process_id)
    user32.EnumWindows(callback, 0)
    return visible_process_ids


def get_processes():
    """Return process details and mark windowed apps separately from background work."""
    processes = []
    app_process_ids = get_visible_window_process_ids()

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
                "create_time": info["create_time"],
                "group": "App" if info["pid"] in app_process_ids else "Background process",
            }
        )

    return sorted(processes, key=lambda process: process["cpu_percent"], reverse=True)
