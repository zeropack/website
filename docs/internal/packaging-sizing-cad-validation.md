# CAD and physical validation pack

This pack turns the internal sizing harness into a small, repeatable validation programme.

## Objective

Validate candidate Zero Pack mailer and layflat-tubing rules without physically sampling every possible size.

The current candidate rules are still **not approved public sizing rules**.

## Files

- `docs/internal/packaging-sizing-validation-cases.csv`
- `src/lib/tools/sizingValidation.mjs`
- `scripts/run-sizing-validation.mjs`

## CAD validation set

Use the curated CSV rather than the full generated matrix.

Priority mailer cases:

1. **M1** — very small/thin
   - verifies the 100 mm minimum-width floor
   - checks whether percentage-based fit becomes meaningless at very small sizes

2. **M2** — very small/deep
   - stresses width + depth geometry

3. **M3 / M4** — 100 mm class
   - directly tests the size range that exposed the fixed-allowance problem
   - compare thin vs thick item

4. **M6 / M7** — common ecommerce medium sizes
   - compare thin vs deep product

5. **M8** — 600 mm flap boundary
   - X/Y remain below the boundary
   - Z lands at 600 mm and should switch to the 50 mm flap rule

6. **M9** — large/deep
   - tests scale-aware clearance on a bulky product

7. **M10** — maximum body-length stress
   - X lands at the current 1,000 mm maximum
   - Y/Z exceed the current supported body length and must route to manual review

Priority tubing cases:

1. **T1 / T2**
   - confirm behaviour below the 100 mm manufactured-width floor

2. **T3**
   - first diameter where geometric layflat width sits above the 100 mm floor

3. **T4 / T5**
   - normal small/medium round items

4. **T6 / T7**
   - larger round items and percentage-scaling behaviour

## Onshape model — mailer

Create one parametric document with these variables:

- `#product_width`
- `#product_length`
- `#product_depth`
- `#bag_body_width`
- `#bag_body_length`
- `#flap_length`
- `#film_thickness` (visual only; 30 μm is too thin to model meaningfully at normal CAD scale)
- `#fit_percent`

Recommended model simplification:

1. Model the packed product as a rectangular solid.
2. Model the bag as an idealised flexible envelope / flattened sleeve with the candidate body width and length.
3. Use the model to check whether the available perimeter/length is geometrically sufficient.
4. Do **not** treat the CAD model as a soft-film physics simulation.
5. Record whether the candidate:
   - geometrically fits;
   - has obvious excess;
   - approaches a seam/closure issue;
   - needs physical validation.

For M8 specifically, model X/Y/Z because it crosses the 600 mm body-length flap boundary.

For M10, model X and show Y/Z as manual-review failures because the body length exceeds 1,000 mm.

## Onshape model — round layflat tubing

Variables:

- `#diameter`
- `#base_layflat = PI * #diameter / 2`
- `#fit_percent`
- `#suggested_layflat`

Model the product as a cylinder.

The tubing model only needs to verify the mathematical wrap/perimeter relationship and the practical amount of extra layflat width.

## Pacdora use

Use Pacdora for:

- box/carton proportion checks;
- measurement-diagram concepts;
- visualising the relationship between inner box and outer mailer;
- future customer-facing measurement illustrations.

Do not rely on Pacdora alone to approve flexible-film fit.

## Physical mock-up shortlist

You do **not** need to physically test every CAD case.

Recommended minimum physical set:

### Mailer
- M3-X — 100 mm-class thin item, minimum fit
- M4-X — 100 mm-class thick item, minimum fit
- M6-X / Y — normal medium thin item
- M7-X / Y — normal medium thick item
- M8-Z — exact 600 mm body boundary
- M9-X — large/deep item
- M10-X — maximum supported body length

### Tubing
- T3-X — near lower practical range
- T4-X / Y — 100 mm round item
- T5-X / Y — medium round item
- T7-X — large round item

If X passes comfortably across these, Y/Z become easier to validate because they only add clearance.

## What to record

For each physical/CAD case:

- fits: yes/no
- easy to load: yes/no
- closure/seal works: yes/no
- too tight / acceptable / too loose
- product movement: low / acceptable / excessive
- appearance: acceptable / poor
- recommended minimum fit level: X/Y/Z/custom
- notes

## Approval rule

A calculator formula should only become public when:

- geometry is sound;
- small-size edge cases are safe;
- flap/body logic is correct;
- the ±5 mm manufacturing tolerance does not make the minimum recommendation unreliable;
- representative physical mock-ups confirm practical use.

If X is unreliable at small sizes, adjust the scale-aware rule with a minimum-mm guardrail rather than increasing every size by the same fixed amount.
