import { Inter } from "next/font/google";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import AuthContext from "@/sessionContext/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Media Gram",
  description: "A Nextjs social media app full stack app",
  icons: {
    icon: ["/favicon.ico?v=4"]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#1D1927]`}>
        <AuthContext>
          <Toaster />
          {children}
        </AuthContext>
      </body>
    </html>
  );
}
