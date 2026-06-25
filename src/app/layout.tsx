import type { Metadata } from "next";
import "./globals.css";
import { MotorDeScroll } from "@/components/motor/MotorDeScroll";
import { FundoOceano } from "@/components/motor/FundoOceano";
import { Telemetria } from "@/components/motor/Telemetria";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { CarrinhoProvider } from "@/components/loja/CarrinhoContexto";
import { CLUBE } from "@/lib/conteudo";

export const metadata: Metadata = {
  metadataBase: new URL("https://surfingviana.com"),
  title: {
    default: "Surf Clube de Viana · Onde o Atlântico nos treina desde 1989",
    template: "%s · Surf Clube de Viana",
  },
  description:
    "Primeira escola de surf de Portugal e Centro de Alto Rendimento. Praia do Cabedelo, Viana do Castelo. Fundado em 1989.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Surf Clube de Viana",
    description:
      "Centro de Alto Rendimento de Surf. Praia do Cabedelo, Viana do Castelo.",
    images: ["/assets/og-image.jpg"],
    locale: "pt_PT",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  name: CLUBE.nome,
  url: "https://surfingviana.com",
  telephone: CLUBE.telefoneRaw,
  email: CLUBE.email,
  foundingDate: "1989",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rua Diogo Álvares, Centro de Alto Rendimento de Surf",
    postalCode: "4935-161",
    addressLocality: "Viana do Castelo",
    addressCountry: "PT",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: CLUBE.gps.lat,
    longitude: CLUBE.gps.lon,
  },
  sameAs: [CLUBE.redes.facebook, CLUBE.redes.instagram],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Narrow:ital,wght@0,400;0,600;0,700;1,600;1,700&family=Spline+Sans+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <CarrinhoProvider>
          <MotorDeScroll>
            <FundoOceano />
            <Telemetria />
            <div className="conteudo">
              <Nav />
              <main id="conteudo">{children}</main>
              <Footer />
            </div>
          </MotorDeScroll>
        </CarrinhoProvider>
      </body>
    </html>
  );
}
