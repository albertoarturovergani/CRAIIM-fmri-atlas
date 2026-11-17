# CRAIIM interactive dashboard — GitHub Pages

This directory contains a fully static research dashboard (`index.html`, CSS, JavaScript and a compact JSON lookup of 161 anatomical labels). It uses no backend, analytics, cookies, or third-party JavaScript libraries.

## Publish the website

1. Open [the repository's Pages settings](https://github.com/albertoarturovergani/CRAIIM-fmri-atlas/settings/pages).
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Select branch **`main`**, folder **`/docs`**, and save.
4. Once GitHub reports a successful deployment, open **https://albertoarturovergani.github.io/CRAIIM-fmri-atlas/**.

The URL is the expected GitHub Pages project address; do not present it as live until the Pages deployment is confirmed.

## Features

- Search the 161 atlas labels transcribed from Vergani's PhD thesis, with source-atlas and hemisphere filters.
- Compare 1 mm and 2 mm voxel counts, measured volumes, and the most voluminous anatomical labels.
- Open an original CRAIIM `.nii` or `.nii.gz` **locally**, with axial, sagittal and coronal slice navigation, crosshairs and region selection.
- Check the original compressed NIfTI checksum when browser security permits `crypto.subtle`.
- Copy the three BibTeX references from `data/references.bib`.

**Privacy:** when a visitor selects a local NIfTI file, the file is read via the browser File API and remains on that device. Its contents are never sent to GitHub, this project, or any third-party service. The site doesn't store it after leaving the page.

**Reproducibility:** the three-plane viewer assumes axis-aligned MNI152 NIfTI grids and rejects other geometries; mismatched SHA-256 checksums are flagged as unverified. The 1 mm and 2 mm atlas labels share the index 1–161, but the differences in measured voxel volumes should not be mistaken for individual-brain effects.

**Rights:** this website does not distribute original NIfTI volumes. For redistribution terms consult the [official FSL license](https://fsl.fmrib.ox.ac.uk/fsl/docs/license.html) and the repository's [license and reuse notes](LICENSE_AND_REUSE.md). Harvard–Oxford components are CC BY-SA 4.0; Jülich data distributed through FSL have non-commercial terms. Public accessibility does not by itself imply unrestricted relicensing.

## Local development

From the **repository root**:

```sh
python -m http.server 8000 --directory docs
```

Then visit `http://localhost:8000` and test the optional NIfTI viewer using your own archival copy.

Metadata are from `metadata/atlas_labels.tsv` and `metadata/atlas_manifest.json` in the repository. The site's `data/regions.json` is generated from those files, so don't edit anatomical names in two separate places.
