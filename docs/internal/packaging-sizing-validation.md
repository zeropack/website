# Packaging sizing validation harness

Internal Zero Pack utility for checking the approved mailer and layflat-tubing calculator rules against a broad range of dimensions and known physical fit tests.

## Governing source

The live Google Drive document `Zero Pack Packaging Calculator Product Capability & Ruleset` is authoritative.

## Approved mailer rule

Minimum recommended body size:

- width = product width + product depth + 5 mm
- body length = product length + product depth / 2 + 15 mm
- round upward to the next 5 mm
- minimum flexible-packaging width reference = 100 mm
- current mailer body-length limit = 1,000 mm

Quoted body dimensions exclude the flap.

Single adhesive:

- body length under 600 mm → 40 mm flap
- body length 600–1,000 mm → 50 mm flap

Double adhesive:

- approximately 70 mm flap

Customer-selected extra room is added on top of the minimum recommended result.

## Approved layflat rule

Minimum recommended layflat width:

- width = product width + product depth + selected width clearance
- minimum width clearance = 5 mm
- round upward to the next 5 mm

Cut length:

- product length + product depth / 2 + selected cutter tail
- minimum cutter tail = 5 mm
- default cutter tail = 15 mm
- round upward to the next 5 mm

## Production tolerance

Typical Zero Pack flexible-packaging dimensional tolerance is ±5 mm.

This is disclosed separately and is not hidden inside the sizing formula.

## Physical validation basis

Mailer rules were checked against actual Zero Pack mailers:

- 150 × 220 mm with an approximately 120 × 190 × 23 mm handmade test box — comfortable fit
- 230 × 320 mm with an approximately 190 × 275 × 30 mm handmade test box — comfortable fit
- 400 × 480 mm with an approximately 360 × 430 × 35–40 mm handmade test box — snug fit

Layflat geometry was checked using:

- 205 mm layflat tubing
- approximately 175 mm wide × 28 mm deep test product
- result: very snug with essentially no movement at approximately 2 mm spare width

That test supports using 5 mm as the minimum practical width clearance rather than treating the geometric minimum as comfortable.

## Validation method

Keep the process simple:

1. Run the mathematical test harness across small, medium and large dimensions.
2. Review edge cases such as the 100 mm minimum width, 600 mm flap boundary and 1,000 mm body limit.
3. Check representative results against actual Zero Pack packaging or simple physical mock-ups.
4. Update the live ruleset if physical evidence shows the rule needs adjustment.
5. Run the matrix again before changing public calculator logic.

CAD/3D modelling is not required for this sizing workflow.

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

Layflat CSV:

```bash
npm run validate:sizing -- --format=csv --product=tubing
```

## Customer-facing safeguard

Calculator results are recommended starting dimensions, not final manufacturing approval.

Use the reminder:

> Measure twice, order once.

For an uncertain custom size, confirm the final fit with a physical sample or mock-up before manufacture.
