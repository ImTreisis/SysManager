import ctypes
import sys

import uvicorn

from backend import app


def show_startup_error(message):
    print(message, file=sys.stderr, flush=True)
    if sys.platform == "win32":
        try:
            ctypes.windll.user32.MessageBoxW(None, message, "Windows System Monitor", 0x10)
        except (AttributeError, OSError):
            pass


def run_agent():
    print("Starting the Windows System Monitor agent at http://127.0.0.1:8765")
    print("Keep this window open while using the dashboard. Press Ctrl+C to stop the agent.")
    try:
        uvicorn.run(
            app,
            host="127.0.0.1",
            port=8765,
            log_level="info",
            access_log=False,
        )
    except KeyboardInterrupt:
        print("The Windows System Monitor agent stopped.")
    except SystemExit as error:
        if error.code not in (None, 0):
            show_startup_error(
                "The agent could not start. Another program may already be using "
                "127.0.0.1:8765. Check the messages above, close the other program, "
                "and try again."
            )
            raise
    except Exception as error:
        show_startup_error(f"The agent could not start: {error}")
        raise SystemExit(1) from error


if __name__ == "__main__":
    run_agent()
