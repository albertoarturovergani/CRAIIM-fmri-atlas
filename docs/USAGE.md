# Using CRAIIM in Python and FSL

## 1. Verify your copy

From the repository root:

```bash
python -m pip install -r requirements.txt
sha256sum -c checksums.sha256
python scripts/inspect_atlases.py
```

This uses nibabel/numpy to verify that each NIfTI has the expected SHA-256, shape, label set, geometry and MNI152 form codes. It recreates the numeric voxel-counts table. The anatomical names table is an independent reconstruction sourced from the PhD thesis.

## 2. Inspect ROI names

```python
import csv
with open("metadata/atlas_labels.tsv",newline="",encoding="utf-8") as f:
    lut={int(x["label_id"]):x for x in csv.DictReader(f,delimiter="\t")}
print(lut[122]["anatomical_label_as_in_thesis"])
```

## 3. Inspect and summarize one volume

```python
import nibabel as nib
import numpy as np
img=nib.load("atlases/original/CRAIIM-maxprob-thr0-2mm.nii.gz")
data=np.asarray(img.dataobj)
labels=data.astype(np.int16)
assert np.array_equal(np.unique(labels),np.arange(162))
roi=122
print("Label",roi,"voxels:",np.count_nonzero(labels==roi))
print("Atlas affine:\n",img.affine)
```

## 4. Aggregate an activation map (only after checking alignment)

```python
import nibabel as nib
import numpy as np
atlas=nib.load("atlases/original/CRAIIM-maxprob-thr0-2mm.nii.gz")
stat=nib.load("path/to/your_aligned_stat_map.nii.gz")
assert atlas.shape==stat.shape
assert np.allclose(atlas.affine,stat.affine,rtol=0,atol=1e-5)
a=np.asarray(atlas.dataobj).astype(np.int16)
s=np.asarray(stat.dataobj)
valid=np.isfinite(s)
region_means={roi:float(np.mean(s[(a==roi)&valid])) if np.any((a==roi)&valid) else float("nan") for roi in range(1,162)}
print(region_means[122])
```

The above computes a **mean over ROI statistic values**, not the historical AWV definition. For comparable AWV values reproduce the original activation thresholding and weighting scheme from the scientific source, and document it separately.

## 5. FSL command-line examples

```bash
fslinfo atlases/original/CRAIIM-maxprob-thr0-2mm.nii.gz
fslstats atlases/original/CRAIIM-maxprob-thr0-2mm.nii.gz -R -V
fslmaths atlases/original/CRAIIM-maxprob-thr0-2mm.nii.gz -thr 122 -uthr 122 -bin roi_122.nii.gz
```

Do **not** use trilinear interpolation on categorical labels. Align functional/statistical images to the atlas grid or, when necessary, resample the atlas with **nearest-neighbour interpolation**. Check orientation, MNI template, affine, voxel size, FSL conventions, subject-specific normalization and left/right consistency.
