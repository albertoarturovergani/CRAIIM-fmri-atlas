# Archival recovery notes

The original NIfTI files and conference materials were recovered from Alberto A. Vergani's historical PhD archive on 25 October 2026. The present annotated repository package was assembled on 17 November 2026.

## Original files preserved

- `atlases/original/CRAIIM-maxprob-thr0-1mm.nii.gz`
- `atlases/original/CRAIIM-maxprob-thr0-2mm.nii.gz`
- `docs/original/INCF_2016_abstract.pdf`
- `docs/original/INCF_2016_poster.pptx`
- `docs/original/HBP_2017_extended_abstract.pdf`
- `docs/original/HBP_2017_poster.pdf`
- `docs/original/CRAIIM_reference_2018.bib`

Original atlas volumes and conference documents were not rewritten. New inspection, provenance and metadata documents are identifiable separately.

## Recovered label lookup, newly transcribed

Although a complete original FSL-compatible `labels.xml` was missing, the PhD thesis Appendix 6.1.1 explicitly documents labels 122–161 and their Harvard–Oxford IDs, and Appendix 6.1.2 documents labels 1–121. `metadata/atlas_labels.tsv` was newly transcribed from that appendix, preserving original spelling and recording original source numbers (where available).

## Still missing

- Original CRAIIM atlas-build scripts combining Jülich and Harvard–Oxford sources.
- Historical parameter logs, authoritative original machine-readable XML companion file and any other unrecovered versions.
- A completed rights/redistribution review for GitHub publication of upstream-atlas-derived images and archival PDFs/PPTX.

The historical `fMRI_SW_AWI_Nov2016/Atlas/lable.txt` found in another context did not offer a complete matching CRAIIM 161-ROI lookup and has **not** been substituted for the thesis transcription.
