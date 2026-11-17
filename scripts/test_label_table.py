from pathlib import Path
import csv
root=Path(__file__).resolve().parents[1]
with (root/"metadata/atlas_labels.tsv").open(encoding="utf-8",newline="") as stream:
    rows=list(csv.DictReader(stream,delimiter="\t"))
assert len(rows)==161
assert [int(x["label_id"]) for x in rows]==list(range(1,162))
assert sum(x["source_atlas_family"]=="juelich" for x in rows)==121
assert sum(x["source_atlas_family"].startswith("harvard_oxford") for x in rows)==40
print("All 161 region labels accounted for")
