import { ThemeProvider } from "@/components/theme-provider";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import { shadesOfPurple } from "@clerk/themes";
import { Toaster } from "sonner";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sprintly",
  description: "Next.js based Jira Clone",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: shadesOfPurple,
        variables:{
          colorPrimary:"#3b82f6",
          colorBackground:"#1a202c",
          colorInputBackground:"#2d3748",
          colorInputText:"#F3F4F6"
        },
        elements:{
          formButtonPrimary:"text-white",
          card:"bg-gray-800",
        },
      }}

    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} dotted-background` }>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="min-h-screen">{children}</main>
            <Toaster richColors />
            <footer className="bg-gray-900 py-12">
              <div className="container mx-auto px-4 text-center text-gray-200">
                <p>Made with ❤️ by Priyanshu</p>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
