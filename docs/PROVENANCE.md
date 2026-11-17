# Provenance and scientific sources

## Who produced CRAIIM?

The CRAIIM hybrid atlas was developed during Alberto A. Vergani's doctoral research at the University of Insubria, in collaboration with Renzo Minotto, Sabina Strocchi and Elisabetta Binaghi. The historical sources are listed in `../references.bib`.

## Source records

- Vergani et al. (2016), *FSL-Based Hybrid Atlas Promotes Activation Weighted Vector Analysis in Functional Neuroradiology* (conference abstract).
- Vergani et al. (2018), *Quantitative Relations between CRAIIM Human Brain Atlases*, HBP Student Conference proceedings (meeting in 2017). The author's archived 2018 citation record uses **of** rather than **between**; both variants are preserved explicitly rather than erased.
- Vergani (2018), *Contributions in Computational Intelligence with Results in Functional Neuroimaging*, PhD thesis, University of Insubria. Original methods in §4.1 and the full numeric region list in Appendix 6.1.1 (new Harvard–Oxford labels) and 6.1.2 (Jülich labels).

## Recovered volumes (archived 25 October 2026)

The atlas NIfTI files were recovered from the historical `PhD/FSL-atlases/CRAIIM` archive. The original compressed bytes remain unchanged. The original source file creation dates cannot be inferred from later Google Drive upload timestamps. Label names in `metadata/atlas_labels.tsv` are **transcribed from the thesis**, not an independently recovered atlas XML file.

## What is new in this release?

- README and methods/usage/licensing documentation.
- Complete ROI table based on the thesis; user should independently verify anatomical spelling and mapping if used for new investigations.
- JSON manifest, numeric region-volume measurements, and a preview figure.
- Updated scholarly bibliography with all three foundational sources and repository CITATION.cff.
- Archival scripts for file integrity checking and preview generation.

This adds documentation and reusable tooling; it does **not** claim the original atlas-building pipeline is reproducible from the recovered materials.
