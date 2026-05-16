import "./globals.css";

export const metadata = {
  title: "PromptWS — Modern AI Workspace",
  description:
    "Transform messy ideas into structured AI-ready prompts, workflows, and tool recommendations. Your intelligent AI creation assistant.",
  keywords: [
    "AI prompts",
    "AI workflow",
    "prompt generator",
    "AI tools",
    "prompt engineering",
    "AI assistant",
    "PromptWS",
  ],
  icons: {
    icon: "/assets/favicon.ico",
    shortcut: "/assets/favicon.ico",
  },
  openGraph: {
    title: "PromptWS — Modern AI Workspace",
    description:
      "Transform messy ideas into structured AI-ready prompts, workflows, and tool recommendations.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f8f9fc" />
        <link rel="icon" href="/assets/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
