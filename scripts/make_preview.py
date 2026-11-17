#!/usr/bin/env python3
"""Render matching MNI152 slices without modifying the archived NIfTI files."""
from pathlib import Path
import colorsys

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap
import nibabel as nib
import numpy as np

root = Path(__file__).resolve().parents[1]
colors = [(0.965, 0.973, 0.980, 1.0)]
for label in range(1, 162):
    rgb = colorsys.hsv_to_rgb((label * 0.618033988749895) % 1.0, 0.58, 0.88)
    colors.append((*rgb, 1.0))
cmap = ListedColormap(colors)
fig, axes = plt.subplots(2, 3, figsize=(11.5, 7.3), facecolor="white")
views = [("Sagittal", 0, 0), ("Coronal", 1, -20), ("Axial", 2, 20)]
for row, resolution in enumerate((1, 2)):
    image = nib.as_closest_canonical(nib.load(
        root / "atlases" / "original" / f"CRAIIM-maxprob-thr0-{resolution}mm.nii.gz"))
    data = np.asarray(image.dataobj)
    for col, (name, axis, coordinate) in enumerate(views):
        world = np.zeros(3)
        world[axis] = coordinate
        index = int(round(nib.affines.apply_affine(np.linalg.inv(image.affine), world)[axis]))
        plane = np.take(data, index, axis=axis).T
        ax = axes[row, col]
        ax.imshow(plane, origin="lower", interpolation="nearest", cmap=cmap, vmin=0, vmax=161)
        ax.set_axis_off()
        if row == 0:
            ax.set_title(f"{name} | {'xyz'[axis]} = {coordinate} mm",
                         fontsize=12, color="#26364A", pad=10)
        if col == 0:
            ax.text(-0.08, 0.5, f"{resolution} mm", transform=ax.transAxes,
                    ha="right", va="center", fontsize=14, fontweight="bold", color="#26364A")
fig.suptitle("CRAIIM hybrid brain atlas", x=0.08, ha="left",
             fontsize=23, fontweight="bold", color="#172B43", y=0.985)
fig.text(0.08, 0.923, "Recovered original volumes | 161 regions | MNI152",
         fontsize=12, color="#58697D")
fig.text(0.08, 0.028, "Matching anatomical coordinates. Colours identify numeric labels consistently across resolutions.",
         fontsize=10, color="#58697D")
fig.subplots_adjust(top=0.855, bottom=0.08, left=0.09, right=0.98, wspace=0.08, hspace=0.08)
output = root / "docs" / "figures" / "atlas_preview.png"
output.parent.mkdir(parents=True, exist_ok=True)
fig.savefig(output, dpi=180, bbox_inches="tight", facecolor="white")
plt.close(fig)
print(output)
