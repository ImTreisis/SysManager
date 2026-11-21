import os

import psutil


PROTECTED_PROCESS_NAMES = {
    "system",
    "system idle process",
    "registry",
    "smss.exe",
    "csrss.exe",
    "wininit.exe",
    "services.exe",
    "lsass.exe",
    "winlogon.exe",
    "explorer.exe",
    "dwm.exe",
    "fontdrvhost.exe",
}
PROTECTED_USER_NAMES = {
    "nt authority\\system",
    "nt authority\\local service",
    "nt authority\\network service",
}


class ProcessControlError(Exception):
    def __init__(self, message, status_code):
        super().__init__(message)
        self.status_code = status_code


def get_agent_process_ids():
    """Return the agent PID and its parent PIDs so it cannot stop itself."""
    process_ids = {os.getpid()}
    try:
        process = psutil.Process(os.getpid())
        process_ids.update(parent.pid for parent in process.parents())
    except (psutil.Error, OSError):
        pass
    return process_ids


def get_agent_username():
    """Return the Windows account running the agent."""
    try:
        return psutil.Process(os.getpid()).username()
    except (psutil.Error, OSError) as error:
        raise ProcessControlError("The agent could not verify its Windows account.", 403) from error


def terminate_process(pid, expected_name, expected_create_time):
    """Stop one matching, non-critical process without force-killing it."""
    if pid <= 4:
        raise ProcessControlError("Windows system processes cannot be stopped here.", 403)
    if pid in get_agent_process_ids():
        raise ProcessControlError("The monitoring agent and its parent processes are protected.", 403)

    try:
        process = psutil.Process(pid)
        name = process.name()
        create_time = process.create_time()
        username = process.username()
    except psutil.NoSuchProcess as error:
        raise ProcessControlError("That process is no longer running. Refresh the list and try again.", 404) from error
    except psutil.AccessDenied as error:
        raise ProcessControlError("Windows denied access to that process, so it was not stopped.", 403) from error

    if not username:
        raise ProcessControlError("Windows could not verify the owner of that process.", 403)
    if username.casefold() != get_agent_username().casefold():
        raise ProcessControlError("You can only stop processes running under the agent's Windows account.", 403)

    if name.casefold() != expected_name.casefold() or abs(create_time - expected_create_time) > 0.01:
        raise ProcessControlError("That process changed since the list was loaded. Refresh the list before trying again.", 409)

    if name.casefold() in PROTECTED_PROCESS_NAMES:
        raise ProcessControlError("This Windows system process is protected.", 403)
    if username.casefold() in PROTECTED_USER_NAMES:
        raise ProcessControlError("Processes running as a Windows service account are protected.", 403)

    try:
        process.terminate()
        process.wait(timeout=3)
        return {"status": "terminated", "pid": pid, "name": name}
    except psutil.NoSuchProcess:
        return {"status": "terminated", "pid": pid, "name": name}
    except psutil.TimeoutExpired:
        return {"status": "termination_requested", "pid": pid, "name": name}
    except psutil.AccessDenied as error:
        raise ProcessControlError("Windows denied permission to stop that process.", 403) from error
