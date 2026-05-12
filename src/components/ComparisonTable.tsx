export function ComparisonTable() {
  const rows = [
    {
      label: "Brand presentation",
      plastic: "Often generic",
      recycled: "Better story than virgin plastic",
      compostable: "Strong custom print story",
    },
    {
      label: "Material positioning",
      plastic: "Conventional plastic",
      recycled: "Recycled plastic content",
      compostable: "Compostable material options (spec-led)",
    },
    {
      label: "Customer messaging risk",
      plastic: "Plastic-heavy perception",
      recycled: "Recycling claims need clarity",
      compostable: "Claims must match certification + disposal routes",
    },
    {
      label: "Typical fit",
      plastic: "Lowest unit cost pressure",
      recycled: "Plastic system familiarity",
      compostable: "Brands reducing plastic reliance",
    },
  ];

  return (
    <div className="overflow-x-auto rounded-2xl border border-black/5 bg-white">
      <table className="min-w-[720px] w-full border-collapse text-left text-sm">
        <thead>
          <tr className="bg-mist/80 text-xs font-semibold uppercase tracking-wide text-compost">
            <th className="px-4 py-3">Comparison</th>
            <th className="px-4 py-3">Plastic mailers</th>
            <th className="px-4 py-3">Recycled plastic mailers</th>
            <th className="px-4 py-3">Compostable mailers</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-t border-black/5">
              <th scope="row" className="px-4 py-4 font-semibold text-charcoal">
                {r.label}
              </th>
              <td className="px-4 py-4 text-charcoal/75">{r.plastic}</td>
              <td className="px-4 py-4 text-charcoal/75">{r.recycled}</td>
              <td className="px-4 py-4 text-charcoal/75">{r.compostable}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
