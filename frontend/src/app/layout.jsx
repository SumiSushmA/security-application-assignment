import { Arvo } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer2 from "@/components/Footer2";
import { AuthProvider } from "@/context/userContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const arvo = Arvo({ weight: "400", subsets: ["latin"] });

export const metadata = {
  title: "quizkoshi",
  description: "An app for taking online exams",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-background">
      <body className={arvo.className}>
        <AuthProvider>
          <Navbar />
          {children}
          <ToastContainer position="top-center" />
          <Footer2 />
        </AuthProvider>
      </body>
    </html>
  );
}
