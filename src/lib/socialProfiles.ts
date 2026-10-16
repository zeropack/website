/** Official shared profiles used by the UI and Organisation structured data. */
export const SOCIAL_PROFILES = [
  { label: "Facebook", href: "https://www.facebook.com/zeropackco", icon: "facebook" },
  { label: "Instagram", href: "https://www.instagram.com/zeropackco/", icon: "instagram" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/zero-pack", icon: "linkedin" },
  { label: "Threads", href: "https://www.threads.com/@zeropackco", icon: "threads" },
  { label: "YouTube", href: "https://www.youtube.com/@zeropackco", icon: "youtube" },
] as const;

export type SocialIcon = (typeof SOCIAL_PROFILES)[number]["icon"];
