module truth_nft::truth_nft {
    use std::string;
    use sui::object;
    use sui::tx_context;
    use sui::transfer;
    use sui::bcs;

    const ENoAccess: u64 = 0;

    public fun seal_approve_address(id: vector<u8>, caller: address) {
        let caller_bytes = bcs::to_bytes(&caller);
        assert!(caller_bytes == id, ENoAccess);
    }

    public struct Proof has key, store {
        id: object::UID,
        blob_id: string::String,
        policy_id: string::String,
        result: string::String,
        proof: string::String,
    }

    public fun mint(
        blob_id_vec: vector<u8>,
        policy_id_vec: vector<u8>,
        result_vec: vector<u8>,
        proof_vec: vector<u8>,
        ctx: &mut tx_context::TxContext
    ) {
        let proof_obj = Proof {
            id: object::new(ctx),
            blob_id: string::utf8(blob_id_vec),
            policy_id: string::utf8(policy_id_vec),
            result: string::utf8(result_vec),
            proof: string::utf8(proof_vec),
        };

        transfer::public_transfer(proof_obj, tx_context::sender(ctx));
    }
}
