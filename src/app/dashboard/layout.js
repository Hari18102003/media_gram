import { Inter } from "next/font/google";
import "../globals.css";
import LeftSideBar from "@/components/layouts/LeftSideBar";
import TopBar from "@/components/layouts/TopBar";
import RightSideBar from "@/components/layouts/RightSideBar";
import BottomBar from "@/components/layouts/BottomBar";
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

export default function DashboardLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-[#1D1927]`}>
                <AuthContext>
                    <Toaster />
                    <main className="w-full flex justify-between">
                        <LeftSideBar />
                        <div>
                            <TopBar />
                            <div className="p-2 md:p-8">
                                {children}
                            </div>
                        </div>
                        <RightSideBar />
                    </main>
                    <BottomBar />
                </AuthContext>
            </body>
        </html>
    );
}
