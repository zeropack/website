export const packagingPathSteps = [
  { title: "Get Your Quote", icon: "quote" },
  { title: "Quote is accepted", icon: "accept" },
  { title: "Dimensions and Design confirmed", icon: "design" },
  { title: "Production begins", icon: "production" },
  { title: "Final product confirmed", icon: "confirm" },
  { title: "Product Shipped", icon: "ship" },
  { title: "You receive your order", icon: "receive" },
  { title: "You start shipping!", icon: "go" },
] as const;

export type PackagingPathStepIcon = (typeof packagingPathSteps)[number]["icon"];
