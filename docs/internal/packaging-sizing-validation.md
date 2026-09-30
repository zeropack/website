# Packaging sizing validation harness

Internal Zero Pack development utility for validating candidate mailer and layflat-tubing sizing rules before those rules are approved for customer-facing calculators.

## Status

Candidate validation logic only. This harness must not be treated as production sizing guidance.

The governing source is the live Google Drive document:

- `Zero Pack Packaging Calculator Product Capability & Ruleset`

## Current candidate logic

### Mailers

Base body geometry:

- width basis = packed product width + packed product depth
- length basis = packed product length + packed product depth

Fit is then modelled as a percentage allowance on those base dimensions.

Current test reference points:

- X = 5%
- Y = 10%
- Z = 15%
- 20% = example above-Z test case

Quoted body dimensions exclude the closure flap.

Candidate single-adhesive flap interpretation:

- body length under 600 mm = 40 mm flap
- body length 600–1000 mm = 50 mm flap

Double adhesive:

- approximately 70 mm flap

Current mailer body maximum:

- 1000 mm

Current flexible-packaging minimum width reference:

- 100 mm

### Round layflat tubing

Base geometry:

```
layflat width = π × diameter ÷ 2
```

Fit is then modelled as a percentage allowance.

### Manufacturing tolerance

Current Zero Pack flexible-packaging tolerance:

- ±5 mm

This is flagged separately from intentional fit allowance and is not silently added to the calculated size.

## Why the harness flags some cases

The purpose of the matrix is to find weak assumptions.

Examples:

- a percentage allowance may be smaller than the ±5 mm production tolerance on very small products;
- the calculated width may fall below the current 100 mm manufacturing-width reference;
- a mailer body may exceed the current 1000 mm maximum;
- a fit value above Z is allowed but sits outside the normal recommendation;
- exact 600 mm body length is explicitly surfaced as a flap-boundary case.

These flags are validation prompts, not customer-facing errors.

## Commands

Summary:

```bash
npm run validate:sizing
```

JSON:

```bash
npm run validate:sizing -- --format=json
```

Mailer CSV:

```bash
npm run validate:sizing -- --format=csv --product=mailer
```

Tubing CSV:

```bash
npm run validate:sizing -- --format=csv --product=tubing
```

## Validation workflow

1. Run the generated matrix.
2. Review flagged small/large/deep edge cases.
3. Select representative cases for CAD checks.
4. Use Onshape for dimensional/geometry validation.
5. Use Pacdora where helpful for packaging visualisation.
6. Physically mock up a smaller representative set.
7. Update the live calculator ruleset.
8. Only then promote an approved formula into the public calculator.

## Important

Do not copy candidate constants directly into public customer-facing calculator components until the live ruleset explicitly marks them approved.
