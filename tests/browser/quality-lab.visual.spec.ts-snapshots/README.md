# Reviewed neutral fixture baselines

Initial review: September 24, 2026, on Ubuntu 24.04.1 under WSL2, Linux x64.
Node 24.19.0; Playwright 1.63.0; Chromium 153.0.8010.12 (revision 1243);
embedded Fontsource Inter 5.3.0, Latin normal weight 400. Locale `en-US`, timezone
UTC, device scale 1, reduced motion, animations disabled, light browser scheme.
The lockfile defines the remaining renderer dependencies.

- `light-visual-linux.png`: 640 × 360, complete light composition.
- `dark-visual-linux.png`: 640 × 360, complete dark composition.
- `delivery-visual-linux.png`: 264 × 128, selected dark Delivery part.

All three initial images were inspected for readable hierarchy, text wrapping,
spacing, border/bounds clipping, variation isolation, and exclusion of the
unrelated Source part from the selected delivery. These are test fixtures, not
approved owner artwork. Expected dimensions are deliberately fixed by the probe.

The reference CI target is Ubuntu 24.04. Its first remote comparison is still
unverified. Other operating systems run behavior/export checks without comparing
their font rasterization to these Linux images. Follow
[the baseline review policy](../../../docs/testing.md#visual-references-and-accessibility)
for any change. Baseline generation alone is not a passing comparison.
