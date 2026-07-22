import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import { ToastProvider } from "../contexts/ToastContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import { ConfirmDialogProvider } from "../contexts/ConfirmDialogContext";

export const metadata: Metadata = {
  title: "Medimate",
  description: "Reliable Empathy in Care",
};

const noFlashScript = `
(function () {
  try {
    if (localStorage.getItem("darkMode") === "true") {
      document.documentElement.classList.add("dark");
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body>
        <ThemeProvider>
          <ToastProvider>
            <ConfirmDialogProvider>
              <AuthProvider>{children}</AuthProvider>
            </ConfirmDialogProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}