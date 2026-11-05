"""Inspect/backfill missing task risk projections in the local fusion DB only."""
import argparse,sys
from pathlib import Path
from urllib.parse import urlsplit
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from backend.config import settings
target=urlsplit(settings.database_url)
if target.hostname not in {'127.0.0.1','localhost','::1'} or target.path!='/fusion':
    raise SystemExit('This tool only supports the local fusion acceptance database.')
from backend.app import app  # register the complete model metadata
from backend.db import Session
from backend.modules.task_packages.models import TaskPackage
from backend.modules.ingestion.models import ImportBatch
from backend.modules.ingestion.package_projection import project_package
from sqlalchemy import select
parser=argparse.ArgumentParser();parser.add_argument('--apply',action='store_true');args=parser.parse_args()
with Session() as db:
    ids=list(db.scalars(select(TaskPackage.id).outerjoin(ImportBatch,ImportBatch.run_id==TaskPackage.run_id)
        .where(TaskPackage.state=='ready',ImportBatch.id.is_(None)).order_by(TaskPackage.package_version)))
print({'missing_projections':len(ids),'apply':args.apply})
if args.apply:
    for ident in ids:
        with Session.begin() as db:project_package(db,db.get(TaskPackage,ident))
    print({'projected':len(ids)})
