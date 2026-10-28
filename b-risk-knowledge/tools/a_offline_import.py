"""Import a frozen A sample into an offline ledger, never into the live task queue."""
import argparse
import json
from pathlib import Path
import sqlite3
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from backend.integrations.a.offline_store import save_export


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('file', type=Path)
    parser.add_argument('--delivery-id', required=True)
    parser.add_argument('--org-id', required=True)
    parser.add_argument('--project-id', required=True)
    kind = parser.add_mutually_exclusive_group(required=True)
    kind.add_argument('--demo', action='store_true')
    kind.add_argument('--non-demo', action='store_true')
    parser.add_argument('--db', type=Path, default=ROOT / '.local/offline-a.sqlite3')
    args = parser.parse_args()
    args.db.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(args.db, timeout=10) as db:
        result = save_export(db, args.file, delivery_id=args.delivery_id, org_id=args.org_id,
                             project_id=args.project_id, is_demo=args.demo)
    print(json.dumps(result, ensure_ascii=False))


if __name__ == '__main__':
    main()
