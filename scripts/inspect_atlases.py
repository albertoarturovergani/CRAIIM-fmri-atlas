#!/usr/bin/env python3
"""Verify recovered CRAIIM atlas files and regenerate measured metadata."""
from pathlib import Path
import csv
import hashlib
import json

import nibabel as nib
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
EXPECTED = {
    "CRAIIM-maxprob-thr0-1mm.nii.gz": {
        "sha256": "64935d824b820ddf0ae5ad1d359359c38a0ffc5d9470e19bb3463c8f6cbc418b",
        "shape": (182, 218, 182),
        "voxel_mm": 1,
    },
    "CRAIIM-maxprob-thr0-2mm.nii.gz": {
        "sha256": "94b3051d70320da319dccdd25b630f428e6bfcddaa3ee403cf4cc2bfe25928e3",
        "shape": (91, 109, 91),
        "voxel_mm": 2,
    },
}


def inspect():
    records = []
    counts_by_resolution = {}
    for filename, expected in EXPECTED.items():
        path = ROOT / "atlases" / "original" / filename
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        if digest != expected["sha256"]:
            raise ValueError(f"Original file checksum mismatch: {filename}")
        image = nib.load(path)
        data = np.asarray(image.dataobj)
        if image.shape != expected["shape"]:
            raise ValueError(f"Unexpected shape: {filename}: {image.shape}")
        if not np.allclose(image.header.get_zooms()[:3], expected["voxel_mm"]):
            raise ValueError(f"Unexpected voxel size: {filename}")
        if not np.isfinite(data).all() or not np.equal(data, np.rint(data)).all():
            raise ValueError(f"Invalid numeric labels: {filename}")
        labels, counts = np.unique(data, return_counts=True)
        if not np.array_equal(labels, np.arange(162)):
            raise ValueError(f"Expected exactly labels 0 through 161: {filename}")
        qform, qcode = image.get_qform(coded=True)
        sform, scode = image.get_sform(coded=True)
        if int(qcode) != 4 or int(scode) != 4 or not np.allclose(qform, sform):
            raise ValueError(f"Unexpected or inconsistent MNI152 transforms: {filename}")
        resolution = expected["voxel_mm"]
        counts_by_resolution[resolution] = counts
        record = {
            "filename": filename,
            "path": str(path.relative_to(ROOT)),
            "sha256": digest,
            "size_bytes": path.stat().st_size,
            "shape": list(image.shape),
            "voxel_sizes_mm": [float(v) for v in image.header.get_zooms()[:3]],
            "storage_dtype": str(image.get_data_dtype()),
            "background_label": 0,
            "nonzero_label_count": 161,
            "minimum_label": 0,
            "maximum_label": 161,
            "all_labels_present": True,
            "background_voxels": int(counts[0]),
            "labelled_voxels": int(counts[1:].sum()),
            "total_voxels": int(data.size),
            "qform_code": int(qcode),
            "sform_code": int(scode),
            "affine": image.affine.tolist(),
            "header_description": image.header["descrip"].tobytes().rstrip(b"\0").decode("utf-8", errors="replace"),
            "anatomical_label_name_table": "metadata/atlas_labels.tsv",
        }
        records.append(record)
        print(f"Verified {filename}: {image.shape}, {resolution} mm, 161 regions, SHA-256 OK")

    metadata_dir = ROOT / "metadata"
    metadata_dir.mkdir(exist_ok=True)
    manifest = {
        "archive_name": "CRAIIM Hybrid Brain Atlas",
        "recovery_date": "2026-10-25",
        "archive_revision_date": "2026-11-17",
        "label_lookup_table": "metadata/atlas_labels.tsv",
        "label_lookup_provenance": "Vergani 2018 thesis, Appendix 6.1.1 and 6.1.2",
        "original_construction_scripts_recovered": False,
        "original_nifti_bytes_preserved": True,
        "records": records,
        "inspection_software": {"numpy": np.__version__, "nibabel": nib.__version__},
    }
    (metadata_dir / "atlas_manifest.json").write_text(
        json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
    )
    with (metadata_dir / "region_voxel_counts.tsv").open("w", newline="", encoding="utf-8") as stream:
        writer = csv.writer(stream, delimiter="\t", lineterminator="\n")
        writer.writerow(["label_id", "voxels_1mm", "voxels_2mm", "volume_mm3_1mm", "volume_mm3_2mm"])
        for label in range(162):
            c1 = int(counts_by_resolution[1][label])
            c2 = int(counts_by_resolution[2][label])
            writer.writerow([label, c1, c2, c1, c2 * 8])
    return records


if __name__ == "__main__":
    inspect()
