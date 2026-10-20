import asyncio
import logging
import sys
from .queue import queue_app, recover_stalled


async def main():
    await queue_app.open_async()
    try:
        await recover_stalled()
        await queue_app.run_worker_async(
            queues=["b01", "b01-maintenance"], concurrency=2,
            update_heartbeat_interval=2, stalled_worker_timeout=10,
            fetch_job_polling_interval=1, install_signal_handlers=sys.platform != "win32",
        )
    finally:
        await queue_app.close_async()


if __name__ == "__main__":
    logging.basicConfig(level=logging.WARNING)
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(main())
