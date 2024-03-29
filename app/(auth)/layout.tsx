import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';

import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	title: 'Threads',
	description: 'A Next.js 13 Threads App Clone ',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<ClerkProvider>
				<body className={`${inter.className} bg-dark-1`}>
					{children}
				</body>
			</ClerkProvider>
		</html>
	);
}
