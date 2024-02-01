import { Inter } from "next/font/google";
import "./globals.scss";
import Bootstrap from "./Components/Bootstrap";
const inter = Inter({ subsets: ["latin"] });
import Link from "next/link";

export const metadata = {
  title: "Diet Exchange List | TanAahara",
  description: "Exchange List Data",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Bootstrap/>
        <p className="text-center mb-1" style={{fontSize: '14px'}}>&copy;{ new Date().getFullYear() } TanAahara</p>
        <p className="text-center" style={{fontSize: '12px'}}>
          <Link href={'https://in.linkedin.com/in/shashank-jallapelli-537559293'} target="_blank" className="text-dark text-decoration-none">developed by: shashank jallapelli</Link>
        </p>
      </body>
    </html>
  );
}
