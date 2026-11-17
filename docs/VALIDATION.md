# Validation and reproducibility checks

## Automated file checks

Run in the complete archive (including binary atlas assets):

```bash
python -m pip install -r requirements.txt
sha256sum -c checksums.sha256
python scripts/inspect_atlases.py
```

Checks include: matching compressed-file SHA-256, expected NIfTI 3D dimensions, voxel dimensions, finite integer-valued label data, precisely 162 values 0–161, qform and sform MNI152 code 4, and matching qform/sform affines.

The two **archival voxel sums** are:

- 1 mm: 7,221,032 total = 5,616,265 background + 1,604,767 labelled.
- 2 mm: 902,629 total = 689,415 background + 213,214 labelled.

The 161 nonzero labels occur in both maps, and the volumes have been preserved byte-identically to the 2026 recovered sources.

## Lookup validation

`metadata/atlas_labels.tsv` should contain exactly the IDs 1..161, sourced as 121 Jülich and 40 selected Harvard–Oxford entries. The source label numbers and spelling come from the doctoral thesis, Appendix 6.1. The lookup is a **documentation transcription**, not recovered original companion code; verify carefully against the thesis and original atlas version if clinical or fine-grained anatomical matching is involved.

## Methodological limitations

A successful integrity test proves the archived files match the recovered data and label assertions; it does not prove that the **original upstream FSL atlas + source code can be rerun** to produce an identical hybrid atlas. Construction scripts were not recovered. The 2-mm and 1-mm grids should not be assumed to have an exact voxel-wise resampling relationship.
