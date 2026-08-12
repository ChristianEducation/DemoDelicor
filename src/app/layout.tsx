import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/fraunces";
import "./globals.css";
import { DemoProvider } from "@/store/demo-store";

export const metadata: Metadata = {
  title: "delicor · Demo comercial",
  description: "Demo comercial navegable de la operación Delicor: Apoderado, Cocina y Administración conectados.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#faf3ea",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CL" data-scroll-behavior="smooth">
      <body>
        <a
          href="#contenido-principal"
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-lg bg-[var(--ink)] px-4 py-3 font-bold text-[var(--paper)] transition-transform focus:translate-y-0"
        >
          Ir al contenido
        </a>
        <DemoProvider>{children}</DemoProvider>
      </body>
    </html>
  );
}
