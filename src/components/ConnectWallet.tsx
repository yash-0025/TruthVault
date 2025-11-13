// 'use client';
// import { ConnectButton } from '@mysten/dapp-kit';

// export default function ConnectWallet() {
//   return (
//     <div className="flex justify-center mb-6">
//       <ConnectButton 
//         connectText="Connect Slush Wallet"
//         className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold"
//       />
//     </div>
//   );
// }

'use client';
import { ConnectButton, useCurrentAccount, useCurrentWallet } from '@mysten/dapp-kit';

export default function ConnectWallet() {
  const account = useCurrentAccount();
  const { currentWallet } = useCurrentWallet();

  return (
    <div className="flex flex-col items-center mb-6">
      <ConnectButton 
        connectText="Connect Wallet"
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold"
      />
      
      {account && currentWallet && (
        <p className="text-xs text-gray-600 mt-2">
          Connected: {currentWallet.name} ({account.address.slice(0, 6)}...{account.address.slice(-4)})
        </p>
      )}
    </div>
  );
}