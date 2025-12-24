import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'HSEQ MVP Chile - Sistema de Auditorías Trinorma',
    description: 'Sistema de gestión de auditorías ISO 9001, 45001, 14001 con cumplimiento Ley 16.744 y DS44',
    keywords: ['HSEQ', 'auditorías', 'ISO 45001', 'ISO 14001', 'ISO 9001', 'Chile', 'Ley 16.744'],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
            <body className={inter.className}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
