# Construction of the CRAIIM Hybrid Brain Atlas

## Sources and scope

CRAIIM was developed at the Centro di Ricerca in Analisi di Immagini e Informatica Medica (University of Insubria) by Alberto A. Vergani in collaboration with Renzo Minotto, Sabina Strocchi and Elisabetta Binaghi. The historical publications document the integration of the **Jülich Histological Atlas** and the **Harvard–Oxford** cortical/subcortical atlas family distributed with FSL.

The anatomical base comprises 121 Jülich regions, and the 40 Harvard–Oxford additions are documented individually in the doctoral thesis, Appendix 6.1.1. The complete 1–161 region lookup in `metadata/atlas_labels.tsv` was transcribed from thesis Appendices 6.1.1 and 6.1.2. The first 121 CRAIIM numbers equal the original numbered Jülich regions as reported in the thesis. The mapping for labels 122–161 stores the corresponding Harvard–Oxford label numbers reported there.

## Historical integration rule

At a fixed atlas resolution and common MNI152 reference grid, define:

- `J(x)` = Jülich categorical region index (0 for no Jülich assignment).
- `H(x)` = chosen Harvard–Oxford categorical region index (where selected), remapped into CRAIIM indices 122–161.

The reconstructed logical merge, from the thesis, is:

```text
C(x) = J(x)  if J(x) != 0
       H(x)  if J(x) == 0 and H(x) is among the 40 selected additions
       0     otherwise
```

Thus overlap is resolved **in favour of Jülich**, rather than averaging atlas probabilities or replacing Jülich labels with Harvard–Oxford labels. This schematic rule is intended to explain the original publication; it is **not** a verified executable reproduction of the historical preprocessing scripts, which are unavailable.

## What do `maxprob` and `thr0` mean?

The recovered historical filenames reflect FSL maximum-probability atlas convention (`maxprob`) at the zero-threshold setting (`thr0`). The **result is a categorical integer-label volume** (although it is stored using a floating-point NIfTI data type), not a 4D stack of regional posterior probabilities. `thr0` is not a new validation confidence threshold or evidence of zero measurement error.

The two files are not related by a *documented* simple resampling step: 1-mm and 2-mm atlas outputs have the same region IDs but distinct grid dimensions and different voxel coverage. Avoid describing the 2-mm volume as trivially created by downsampling the supplied 1-mm file.

## Quantitative properties

| Measure | 1-mm atlas | 2-mm atlas |
| --- | ---: | ---: |
| Image dimensions | 182 × 218 × 182 | 91 × 109 × 91 |
| Nonzero region IDs | 161 | 161 |
| Background ID | 0 | 0 |
| Background voxels | 5,616,265 | 689,415 |
| Labelled voxels | 1,604,767 | 213,214 |
| Total voxels | 7,221,032 | 902,629 |
| Physical volume per voxel | 1 mm³ | 8 mm³ |

The historical thesis (Table 4.1) further decomposes the region-containing voxels into Jülich and Harvard–Oxford components:

| Contribution | 1-mm voxels | 2-mm voxels |
| --- | ---: | ---: |
| Jülich | 1,096,184 | 150,452 |
| Harvard–Oxford cortical | 497,974 | 61,797 |
| Harvard–Oxford subcortical | 10,609 | 965 |
| **Total** | **1,604,767** | **213,214** |

The exact original atlas-construction scripts, software dependencies and parameter log were not recovered; these counts therefore describe the historical outputs and measured saved volumes, **not a complete executable reproduction of atlas generation from upstream FSL distributions**.

## Relationship to fMRI analysis / AWV

CRAIIM supports anatomical localization and ROI-level summarization of voxel-wise activation, particularly Activation Weighted Vector workflows in functional neuroradiology. It can be used to assign suprathreshold activated voxels or regional statistics to an anatomical index, enabling descriptive region vectors and downstream comparisons.

**CRAIIM does not intrinsically produce fMRI statistics.** The upstream GLM/statistical workflow, threshold decisions, warping, interpolation and any AWV weighting scheme are separate analysis choices that must be documented by the researcher. For the original AWV methodology see Vergani et al. (2016) and the thesis (2018).

## Anatomical label provenance

`metadata/atlas_labels.tsv` contains one row for each ROI, the spelling as printed in Appendix 6.1, the parent atlas, original atlas index where reported, and measured region counts at both resolutions. Some apparent original typographical variants are not silently revised; verify names before relying on them as a clinical ontology or external atlas crosswalk.

## References

See `../references.bib` and the links in `../README.md`.
