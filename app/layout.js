import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Explorify",
  description:
    "Explorify gives Spotify users endless music and artist recommendations based on the song they're currently listening to.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2a2a2a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
