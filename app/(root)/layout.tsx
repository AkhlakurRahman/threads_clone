import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import { ClerkProvider } from '@clerk/nextjs';

import Header from '../../components/shared/Header';
import LeftSidebar from '@/components/shared/LeftSidebar';
import RightSidebar from '@/components/shared/RightSidebar';
import Footer from '@/components/shared/Footer';

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
				<body className={inter.className}>
					<Header />
					<main>
						<LeftSidebar />

						<section className='main-container'>
							<div className='w-full max-w-4xl'>{children}</div>
						</section>

						<RightSidebar />
					</main>
					<Footer />
				</body>
			</ClerkProvider>
		</html>
	);
}
