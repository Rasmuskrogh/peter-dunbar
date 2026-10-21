import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<StructuredData />
			<Header />
			<main>{children}</main>
			<Footer />
		</>
	);
}
