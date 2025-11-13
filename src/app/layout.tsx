// 'use client';

// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import '@mysten/dapp-kit/dist/index.css';
// import { createNetworkConfig, SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
// import { getFullnodeUrl } from "@mysten/sui/client";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// // Configure network
// const { networkConfig } = createNetworkConfig({
//   testnet: { url: getFullnodeUrl("testnet") },
// });

// const queryClient = new QueryClient();

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         <QueryClientProvider client={queryClient}>
//           <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
//             <WalletProvider autoConnect>
//               {children}
//             </WalletProvider>
//           </SuiClientProvider>
//         </QueryClientProvider>
//       </body>
//     </html>
//   );
// }

'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import '@mysten/dapp-kit/dist/index.css';
import { createNetworkConfig, SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Configure network
const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl("testnet") },
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientProvider client={queryClient}>
          <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
            <WalletProvider 
              autoConnect
              preferredWallets={['Slush Wallet']}
            >
              {children}
            </WalletProvider>
          </SuiClientProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}