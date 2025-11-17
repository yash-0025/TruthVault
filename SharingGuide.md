# 📋 Complete Guide: How to Share and View Health Proofs

## 🎯 Overview

After minting your health proof NFT, you can share it with institutions (banks, insurance companies, employers) and grant them permission to view the encrypted data.

---

## 📝 Step-by-Step Guide

### **Step 1: Mint Your Proof NFT** ✅

1. **Upload Health Report**
   - Go to the main app page
   - Connect your Sui wallet
   - Upload your health report (PDF/CSV/TXT)
   - The data is automatically encrypted

2. **Run AI Analysis**
   - Click "Prove My Health" button
   - AI analyzes your health data
   - Result is encrypted and stored on Walrus

3. **Mint NFT**
   - The system automatically mints your proof NFT
   - **Important**: The proof object ID is saved automatically
   - You'll see a success message with the transaction digest

---

### **Step 2: View Your Own Data** 👁️

1. **On the Main App Page**
   - Scroll to the "View Your Health Data" section
   - Click "View & Decrypt Data" button
   - Your wallet will be used to decrypt the data
   - You'll see:
     - Your encrypted health report (CSV)
     - Your health assessment result
   - You can download both files

**Note**: Only you (the owner) can decrypt by default using your wallet address.

---

### **Step 3: Share Your Proof** 📤

1. **Get Shareable Links**
   - Scroll to the "Share Your Proof" section
   - You'll see three options:
     - **Share Transaction Link**: Shareable URL for viewers
     - **Transaction Digest**: The blockchain transaction hash
     - **Proof Object ID**: The unique NFT object ID

2. **Copy the Share Transaction Link**
   - Click the copy button next to "Share Transaction Link"
   - This creates a URL like: `https://your-domain.com/view?tx=0x...`
   - Send this link to the institution

3. **Alternative: Share Object ID**
   - If you prefer, share the Proof Object ID directly
   - The viewer can use: `https://your-domain.com/view?id=0x...`

---

### **Step 4: Grant Access to Viewers** 🔐

**Before viewers can decrypt the data, you must grant them access:**

1. **Go to Access Control Section**
   - Scroll to "Access Control" on the main app page

2. **Enter Viewer's Wallet Address**
   - Get the Sui wallet address from the institution/viewer
   - Paste it in the "Viewer Address" field
   - Format: `0x...` (Sui wallet address)

3. **Set Access Duration**
   - Choose how long they can access (7 days, 30 days, 90 days, 6 months)
   - Default is 30 days

4. **Click "Grant Access"**
   - Approve the transaction in your wallet
   - The viewer is now added to the approved list
   - They can now decrypt and view your data

**Important**: 
- Only the owner can grant access
- Access is time-limited based on your selection
- You can revoke access anytime (feature to be added)

---

### **Step 5: How Viewers Access the Data** 👥

**For the institution/viewer who received your link:**

1. **Open the Share Link**
   - They receive: `https://your-domain.com/view?tx=0x...`
   - Or: `https://your-domain.com/view?id=0x...`
   - Opens the "View Health Proof" page

2. **Connect Their Wallet**
   - They must connect their Sui wallet
   - **Important**: They must use the same wallet address you granted access to

3. **View & Decrypt Data**
   - Click "View & Decrypt Data" button
   - The system checks:
     - ✅ Are they the owner? OR
     - ✅ Are they in the approved viewers list?
   - If authorized, data is decrypted and displayed
   - They can view:
     - Health report (CSV data)
     - Health assessment result
   - They can download both files

4. **If Access Denied**
   - Error message: "You do not have permission to view this data"
   - They need to contact you to grant access
   - You must use "Access Control" to add their wallet address

---

## 🔄 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    YOU (Owner)                           │
├─────────────────────────────────────────────────────────┤
│ 1. Upload Report → Encrypt → Mint NFT                   │
│ 2. View Your Data (automatic access)                    │
│ 3. Share Transaction Link                              │
│ 4. Grant Access to Viewer's Wallet Address              │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│              INSTITUTION (Viewer)                        │
├─────────────────────────────────────────────────────────┤
│ 1. Receive Share Link                                    │
│ 2. Open Link → Connect Wallet                           │
│ 3. Click "View & Decrypt Data"                          │
│ 4. System Checks: Owner OR Approved?                    │
│    ✅ YES → Decrypt & Display Data                     │
│    ❌ NO → Show Error (Need Access)                     │
└─────────────────────────────────────────────────────────┘
```

---

## 🔑 Key Points

### **Privacy & Security**
- ✅ All data is encrypted using threshold encryption
- ✅ Only blob_id references stored on-chain (no plaintext)
- ✅ Only owner and approved viewers can decrypt
- ✅ Access is time-limited
- ✅ Owner controls all permissions

### **What's Stored Where**
- **On-Chain (Sui Blockchain)**: 
  - Proof object ID
  - Blob IDs (references to encrypted data)
  - Policy IDs (encryption keys)
  - Approved viewers list
  - **NO plaintext medical data**

- **Off-Chain (Walrus Storage)**:
  - Encrypted health report (CSV)
  - Encrypted health assessment result
  - **All encrypted, requires key to decrypt**

### **Access Control**
- Owner can always decrypt (uses their wallet address)
- Viewers must be explicitly granted access
- Access is granted per wallet address
- Access duration is set by owner
- Access can be revoked (feature coming soon)

---

## 🛠️ Troubleshooting

### **"Proof object ID not found"**
- **Solution**: Make sure you've minted the NFT first
- Check that the transaction was successful
- Try refreshing the page

### **"You do not have permission to view this data"**
- **For Owner**: Make sure you're using the same wallet that minted the NFT
- **For Viewer**: The owner must grant you access first
- Check that you're using the correct wallet address

### **"Could not get proof object ID from transaction"**
- The transaction might not be confirmed yet
- Wait a few seconds and try again
- Check the transaction on Sui Explorer

### **"Failed to decrypt data"**
- Make sure you're using the correct wallet
- Check that the encryption policy matches
- Verify you have access permissions

---

## 📞 Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify your wallet is connected
3. Ensure the transaction was successful
4. Check that access was properly granted

---

## 🎉 Summary

**For You (Owner):**
1. Mint NFT → View Data → Share Link → Grant Access

**For Viewers:**
1. Receive Link → Connect Wallet → View Data (if access granted)

**Remember**: Data is always encrypted. Only authorized users can decrypt and view it!

