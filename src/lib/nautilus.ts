// let wasm: any = null;

// async function load() {
//   if (!wasm) {
//     // nautilus_wasm.js auto-initializes the wasm on import
//     const module = await import('../../public/pkg/nautilus_wasm.js');
//     wasm = module;     // module.infer, module.get_proof
//   }
//   return wasm;
// }

// export async function runNautilusAI(csv: string) {
//   const w = await load();

//   const output = w.infer(csv);      // ✔ works
//   const proof = w.get_proof();      // ✔ works

//   return { output, proof };
// }


let wasm: any = null;

async function load() {
  if (!wasm) {
    try {
      console.log("🔧 Loading WASM module...");
      const module = await import('../../public/pkg/nautilus_wasm.js');
      wasm = module;
      console.log("✅ WASM loaded successfully");
      console.log("Available functions:", Object.keys(wasm));
    } catch (err) {
      console.error("❌ Failed to load WASM:", err);
      throw err;
    }
  }
  return wasm;
}

export async function runNautilusAI(csv: string) {
  console.log("🤖 runNautilusAI called with CSV:", csv);
  
  try {
    const w = await load();
    
    console.log("Calling infer()...");
    const output = w.infer(csv);
    console.log("Infer result:", output);
    
    console.log("Calling get_proof()...");
    const proof = w.get_proof();
    console.log("Proof result:", proof);

    return { output, proof };
  } catch (err) {
    console.error("❌ Nautilus AI error:", err);
    throw err;
  }
}