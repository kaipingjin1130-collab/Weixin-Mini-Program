"""Forced SSH command: one bounded HTTP request to the loopback identity gateway."""
import socket
import sys


def main():
    request = sys.stdin.buffer.read(8193)
    if not request or len(request) > 8192:
        raise SystemExit(1)
    with socket.create_connection(('127.0.0.1', 18819), timeout=10) as conn:
        conn.sendall(request)
        conn.shutdown(socket.SHUT_WR)
        remaining = 65536
        while remaining:
            data = conn.recv(min(remaining, 8192))
            if not data:
                break
            sys.stdout.buffer.write(data)
            remaining -= len(data)


if __name__ == '__main__':
    main()
