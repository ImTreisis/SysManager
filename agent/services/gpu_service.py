import json
import os
import subprocess


GPU_COUNTER_SCRIPT = r"""
$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

try {
    $controllers = @(
        Get-CimInstance -ClassName Win32_VideoController |
            Where-Object { $_.Name -and $_.Name -notmatch 'virtual|RemoteFX' } |
            ForEach-Object {
                $memoryBytes = $null
                if ($_.AdapterRAM -gt 0 -and $_.AdapterRAM -lt 4290000000) {
                    $memoryBytes = [int64]$_.AdapterRAM
                }
                [ordered]@{
                    name = $_.Name
                    adapter_memory_bytes = $memoryBytes
                }
            }
    )

    $counterPaths = @(
        '\GPU Engine(*)\Utilization Percentage',
        '\GPU Adapter Memory(*)\Dedicated Usage',
        '\GPU Adapter Memory(*)\Shared Usage'
    )
    $samples = @()
    try {
        $samples = @(
            (Get-Counter -Counter $counterPaths -SampleInterval 1 -MaxSamples 1).CounterSamples
        )
    } catch {
        $samples = @()
    }

    $engineTotals = @{}
    $dedicatedMemoryBytes = 0.0
    $sharedMemoryBytes = 0.0
    $hasEngineCounters = $false
    $hasMemoryCounters = $false

    foreach ($sample in $samples) {
        if ($sample.Status -ne 0) { continue }

        if ($sample.Path -match '\\GPU Engine\(.+\)\\Utilization Percentage$') {
            $hasEngineCounters = $true
            if ($sample.InstanceName -match 'luid_(.+?)_phys_(\d+)_eng_(\d+)_') {
                $engineKey = "$($Matches[1])_phys_$($Matches[2])_eng_$($Matches[3])"
            } else {
                $engineKey = $sample.InstanceName
            }
            if (-not $engineTotals.ContainsKey($engineKey)) { $engineTotals[$engineKey] = 0.0 }
            $engineTotals[$engineKey] += [double]$sample.CookedValue
        } elseif ($sample.Path -match '\\GPU Adapter Memory\(.+\)\\Dedicated Usage$') {
            $hasMemoryCounters = $true
            $dedicatedMemoryBytes += [double]$sample.CookedValue
        } elseif ($sample.Path -match '\\GPU Adapter Memory\(.+\)\\Shared Usage$') {
            $hasMemoryCounters = $true
            $sharedMemoryBytes += [double]$sample.CookedValue
        }
    }

    $utilizationPercent = $null
    if ($engineTotals.Count -gt 0) {
        $utilizationPercent = [math]::Round([math]::Min(100, ($engineTotals.Values | Measure-Object -Maximum).Maximum), 1)
    }

    $isAvailable = ($controllers.Count -gt 0 -or $hasEngineCounters -or $hasMemoryCounters)
    $reason = $null
    if (-not $hasEngineCounters -and -not $hasMemoryCounters) {
        $reason = 'GPU names may be available, but Windows GPU usage counters are unavailable.'
    }

    [ordered]@{
        available = $isAvailable
        devices = @($controllers)
        utilization_percent = $utilizationPercent
        dedicated_memory_used_bytes = if ($hasMemoryCounters) { [int64]$dedicatedMemoryBytes } else { $null }
        shared_memory_used_bytes = if ($hasMemoryCounters) { [int64]$sharedMemoryBytes } else { $null }
        reason = $reason
    } | ConvertTo-Json -Compress -Depth 4
} catch {
    [Console]::Error.WriteLine($_.Exception.Message)
    exit 1
}
"""


def get_gpu_info():
    """Return GPU names, utilization, and memory usage from Windows counters."""
    if os.name != "nt":
        return {"available": False, "devices": [], "reason": "GPU telemetry is available on Windows only."}

    try:
        result = subprocess.run(
            ["powershell.exe", "-NoProfile", "-NonInteractive", "-Command", GPU_COUNTER_SCRIPT],
            capture_output=True,
            text=True,
            encoding="utf-8",
            timeout=8,
            check=True,
            creationflags=subprocess.CREATE_NO_WINDOW,
        )
        gpu_info = json.loads(result.stdout)
        if gpu_info.get("reason") is None and not gpu_info["available"]:
            gpu_info["reason"] = "Windows did not report GPU devices or counters."
        return gpu_info
    except (OSError, subprocess.SubprocessError, json.JSONDecodeError, KeyError, TypeError):
        return {
            "available": False,
            "devices": [],
            "utilization_percent": None,
            "dedicated_memory_used_bytes": None,
            "shared_memory_used_bytes": None,
            "reason": "Windows GPU performance counters are unavailable.",
        }
