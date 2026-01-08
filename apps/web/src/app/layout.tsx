import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wypożyczalnia samochodów",
  description: "Projekt z kursu Bazy Danych i Zarządzanie Informacją",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider> {}
          {children}
          <Toaster /> {}
        </AuthProvider>
      </body>
    </html>
  );
}