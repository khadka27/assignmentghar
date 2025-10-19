export const chatThread = [
  {
    id: "m1",
    from: "student" as const,
    text: "Hi! I need help with my database report.",
    ts: "10:02",
    seen: true,
  },
  {
    id: "m2",
    from: "admin" as const,
    text: "Please submit your module guide and deadline.",
    ts: "10:03",
    seen: true,
  },
  {
    id: "m3",
    from: "student" as const,
    text: "Uploaded the PDF. Can you review?",
    ts: "10:05",
    seen: true,
    file: { name: "ModuleGuide.pdf", size: "1.2MB" },
  },
  {
    id: "m4",
    from: "admin" as const,
    text: "Got it. Please scan the QR to proceed. Work starts after payment.",
    ts: "10:06",
    seen: true,
  },
];

export const assignmentStatus = "Awaiting Payment";
