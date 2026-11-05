"""Own one subprocess tree, kill it on cancellation/timeout and never unrelated PIDs."""
import ctypes
from ctypes import wintypes
import json
import os
import queue
import signal
import subprocess
import threading
import time


class Tree:
    def __init__(self, process):
        self.process=process
        self.handle=None
        if os.name=='nt':
            class Basic(ctypes.Structure):
                _fields_=[('ProcessTime',ctypes.c_int64),('JobTime',ctypes.c_int64),('Flags',wintypes.DWORD),
                    ('MinWorking',ctypes.c_size_t),('MaxWorking',ctypes.c_size_t),('ActiveProcess',wintypes.DWORD),
                    ('Affinity',ctypes.c_size_t),('Priority',wintypes.DWORD),('Scheduling',wintypes.DWORD)]
            class IO(ctypes.Structure):
                _fields_=[(n,ctypes.c_uint64) for n in ('ReadOps','WriteOps','OtherOps','ReadBytes','WriteBytes','OtherBytes')]
            class Extended(ctypes.Structure):
                _fields_=[('Basic',Basic),('IO',IO),('ProcessMemory',ctypes.c_size_t),('JobMemory',ctypes.c_size_t),('PeakProcess',ctypes.c_size_t),('PeakJob',ctypes.c_size_t)]
            kernel=ctypes.WinDLL('kernel32',use_last_error=True)
            kernel.CreateJobObjectW.restype=wintypes.HANDLE
            kernel.CreateJobObjectW.argtypes=[ctypes.c_void_p,wintypes.LPCWSTR]
            kernel.SetInformationJobObject.argtypes=[wintypes.HANDLE,ctypes.c_int,ctypes.c_void_p,wintypes.DWORD]
            kernel.AssignProcessToJobObject.argtypes=[wintypes.HANDLE,wintypes.HANDLE]
            kernel.CloseHandle.argtypes=[wintypes.HANDLE]
            handle=kernel.CreateJobObjectW(None,None)
            info=Extended();info.Basic.Flags=0x2000  # JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE
            if not handle or not kernel.SetInformationJobObject(handle,9,ctypes.byref(info),ctypes.sizeof(info)) or not kernel.AssignProcessToJobObject(handle,wintypes.HANDLE(process._handle)):
                if handle:kernel.CloseHandle(handle)
                process.kill();process.wait()
                raise RuntimeError('process_tree_isolation_failed')
            self.handle,self.kernel=handle,kernel

    def close(self):
        if self.handle:
            self.kernel.CloseHandle(self.handle);self.handle=None
        elif os.name!='nt':
            try:os.killpg(self.process.pid,signal.SIGKILL)
            except ProcessLookupError:pass
        if self.process.poll() is None:self.process.kill()
        self.process.wait(timeout=10)


def run(command, data, env, timeout, tick=lambda:None, progress=lambda event:None):
    child=subprocess.Popen(command,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.DEVNULL,
        env=env,creationflags=subprocess.CREATE_NO_WINDOW if os.name=='nt' else 0,start_new_session=os.name!='nt')
    tree=Tree(child)
    lines=queue.Queue(maxsize=64)
    def read():
        while True:
            line=child.stdout.readline(2_000_001)
            if not line:break
            try:lines.put(line,timeout=1)
            except queue.Full:break
        try:lines.put(None,timeout=1)
        except queue.Full:pass
    reader=threading.Thread(target=read,daemon=True);reader.start()
    result=None;total=0;started=time.monotonic()
    try:
        child.stdin.write((json.dumps(data,ensure_ascii=False)+'\n').encode('utf-8'));child.stdin.close()
        while True:
            if time.monotonic()-started>timeout:raise TimeoutError('component_timeout')
            tick()
            try:line=lines.get(timeout=.25)
            except queue.Empty:continue
            if line is None:break
            total+=len(line)
            if total>8_000_000 or len(line)>2_000_000:raise RuntimeError('component_output_limit')
            event=json.loads(line)
            if event['type']=='error':raise RuntimeError('component_'+event.get('error_type','error'))
            if event['type']=='result':result=event['result']
            else:progress(event)
        child.wait(timeout=5)
        if child.returncode or result is None:raise RuntimeError('component_failed')
        return result
    finally:
        tree.close();reader.join(timeout=2)

