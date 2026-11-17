# Downloads and file inventory

## Atlas files

| Asset | Relative download | SHA-256 |
| --- | --- | --- |
| CRAIIM 1 mm | `CRAIIM-maxprob-thr0-1mm.nii.gz` (author's archive; public download pending rights review) | `64935d824b820ddf0ae5ad1d359359c38a0ffc5d9470e19bb3463c8f6cbc418b` |
| CRAIIM 2 mm | `CRAIIM-maxprob-thr0-2mm.nii.gz` (author's archive; public download pending rights review) | `94b3051d70320da319dccdd25b630f428e6bfcddaa3ee403cf4cc2bfe25928e3` |

The two files were recovered from the author's original PhD-era Google Drive archive and preserved without relabelling, resampling or recompression. A public GitHub release should be created **only after checking redistribution permissions**. See [Licensing and reuse](LICENSE_AND_REUSE.md).

## File inventory

The anatomical lookup, metadata, scripts and preview are included here. The `docs/original/` documents below are **historical source files in the author's archive**, not files distributed by this public repository.

- `metadata/atlas_labels.tsv`: 161 ROI names transcribed from thesis Appendix 6.1, parent atlas and source labels, counts.
- `metadata/region_voxel_counts.tsv`: all numeric label counts, including background.
- `metadata/atlas_manifest.json`: metadata, affine matrices, SHA-256, voxel counts.
- `docs/figures/atlas_preview.png`: figure generated during archival recovery.
- `docs/original/INCF_2016_abstract.pdf`: original conference abstract.
- `docs/original/INCF_2016_poster.pptx`: original conference poster.
- `docs/original/HBP_2017_poster.pdf`: original HBP conference poster.
- `docs/original/HBP_2017_extended_abstract.pdf`: original conference extended abstract.
- `docs/original/CRAIIM_reference_2018.bib`: original preserved BibTeX record, distinct from the harmonized repository `references.bib`.
- `scripts/inspect_atlases.py`, `scripts/make_preview.py`: archival inspection and visualization scripts, not the original atlas-building scripts.

## Public scholarly links

- [Frontiers 2016 abstract, DOI:10.3389/conf.fninf.2016.20.00077](https://doi.org/10.3389/conf.fninf.2016.20.00077)
- [Human Brain Project Student Conference proceedings (ISBN 978-2-88945-421-1)](https://sos-ch-dk-2.exo.io/public-website-production-2022/filer_public/a3/76/a3766610-0aa4-46cf-822a-163fa9cfa779/9782889454211.pdf)
- [Vergani 2018 PhD thesis, University of Insubria](https://irinsubria.uninsubria.it/retrieve/e2188be7-5825-4564-e053-6605fe0a49d6/PhD_Thesis_VerganiAlbertoArturo_completa.pdf)
- [FSL / Oxford resources](https://fsl.fmrib.ox.ac.uk/fsl/docs/)
- [FSL license](https://fsl.fmrib.ox.ac.uk/fsl/docs/license.html)

**Important:** Google Drive links to the archival copy may require author access and should not be presented as anonymous public downloads. The original binaries in the local/research archive are the files identified by the SHA-256 checksums above.
