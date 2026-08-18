export const scroll = {
  thumbMinPx: 48,
  trackPad: 8,
} as const;

export const heroClips = [
  { src: "/media/electronics.mp4", label: "electronics" },
  { src: "/media/robot.mp4", label: "robot" },
  { src: "/media/dog.mp4", label: "dog" },
] as const;

export const reelMotion = {
  fade: 1.15,
  lead: 0.2,
  fromScale: 1.06,
  toScale: 1.03,
} as const;

export const hudCta = {
  label: "Train the future economy",
  href: "",
  path: [
    [1020, 372],
    [1148, 372],
    [1148, 218],
    [1236, 218],
  ],
} as const;

export const hudPins = [
  {
    id: "vault",
    label: "ENTER VAULT",
    href: "#vault",
    path: [
      [820, 528],
      [688, 528],
      [688, 692],
      [776, 692],
    ],
  },
  {
    id: "gpu",
    label: "GPU TRAY | LIVE",
    href: "",
    path: [
      [1088, 556],
      [1212, 556],
      [1212, 708],
      [1296, 708],
    ],
  },
] as const;

export const floorCards = [
  {
    id: "floor",
    span: "wide",
    title: "Capital hits the floor",
    body: "Let GPUs and robotics earn for you when you stake your tokenized stocks, crypto, or gold.",
  },
  {
    id: "ledger",
    span: "narrow",
    title: "Earn with onchain task",
    body: "Earn by completing machine-training tasks and prove the work by minting the task NFT on the Robinhood blockchain.",
  },
  {
    id: "gpu",
    span: "third",
    title: "GPU trays that stay live",
    body: "Racks do the compute. Yield is billed hours from trays that stay live.",
  },
  {
    id: "robots",
    span: "third",
    title: "Robot cells at work",
    body: "Machine-hours on the floor. Capital pays for cells that actually move.",
  },
  {
    id: "exit",
    span: "third",
    title: "Smart liquidity via REV",
    body: "Traditional real-world machine work are slow and long-term. Our proprietary mechanism REV solves that with smart liquidity",
  },
] as const;

export const atlasBlock = {
  pill: "Atlas",
  title: ["Earn from AI machines", "that work worldwide."] as const,
  stats: [
    { value: "123k$", label: "Total value locked" },
    { value: "3+", label: "Robot cells live" },
    { value: "17+", label: "GPU trays billed" },
    { value: "18+", label: "Tasks posted" },
  ],
  launch: { label: "Launch App", href: "#vault" },
  tasks: { label: "Tasks", href: "#vault" },
} as const;

export const loopApp = {
  name: "FORGE Vault",
  pills: ["Mainnet", "Vault 01"] as const,
  status: "Synced",
  zoom: "100%",
  fit: "Fit",
  action: "Deploy",
  flows: [
    { id: "stake", steps: ["Deposit assets", "Earn yield", "Earn points"] },
    { id: "tasks", steps: ["Complete tasks", "Earn points and rewards"] },
  ],
  actions: [
    { id: "vault", label: "Enter Vault", href: "#vault" },
    { id: "tasks", label: "Tasks", href: "#vault" },
  ],
} as const;

export const footerBlock = {
  wordmark: "FORGE",
  contact: {
    label: "Contact",
    email: "hello@forge.ai",
    line: "Built for working machines",
  },
  socials: [
    { label: "Twitter / X", href: "https://x.com" },
    { label: "GitHub", href: "https://github.com" },
    { label: "Telegram", href: "https://telegram.org" },
  ],
  ctas: [
    { label: "Launch App", href: "#vault", primary: true },
    { label: "Tasks", href: "#vault", primary: false },
  ],
  note: "Stake once · Machines earn · Yield is billed machine-hours",
  columns: [
    {
      title: "Explore",
      links: [
        { label: "Protocol", href: "#work" },
        { label: "Vault", href: "#vault" },
        { label: "Atlas", href: "#atlas" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "How it works", href: "#loop" },
        { label: "Tasks", href: "#vault" },
        { label: "Contact", href: "#footer" },
      ],
    },
  ],
  legal: [
    { label: "Privacy policy", href: "#" },
    { label: "Terms of use", href: "#" },
    { label: "Cookies", href: "#" },
  ],
  owner: "FORGE AI",
} as const;

export const loopBlock = {
  pill: "Loop",
  heading: "How it works",
  // Swap this for the real cut once it is recorded.
  film: {
    src: "/media/loop-film.mp4",
    poster: "/media/poster.jpg",
  },
} as const;
