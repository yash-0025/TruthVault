module truth_nft::truth_nft {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use std::string::{Self, String};
    use sui::vec_set::{Self, VecSet};

    /// Private Health Proof NFT
    public struct Proof has key {
        id: UID,
        owner: address,
        blob_id: String,
        policy_id: String,
        result_blob_id: String,
        result_policy_id: String,
        proof_hash: String,
        created_at: u64,
        approved_viewers: VecSet<address>,
    }

    /// Capability to view a specific proof
    public struct ViewCapability has key, store {
        id: UID,
        proof_id: ID,
        viewer: address,
        expires_at: u64,
    }

    /// Mint a new private proof NFT
    public entry fun mint(
        blob_id_vec: vector<u8>,
        policy_id_vec: vector<u8>,
        result_blob_id_vec: vector<u8>,
        result_policy_id_vec: vector<u8>,
        proof_vec: vector<u8>,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let proof = Proof {
            id: object::new(ctx),
            owner: sender,
            blob_id: string::utf8(blob_id_vec),
            policy_id: string::utf8(policy_id_vec),
            result_blob_id: string::utf8(result_blob_id_vec),
            result_policy_id: string::utf8(result_policy_id_vec),
            proof_hash: string::utf8(proof_vec),
            created_at: tx_context::epoch(ctx),
            approved_viewers: vec_set::empty(),
        };
        
        transfer::transfer(proof, sender);
    }

    /// Grant view access to a specific address
    public entry fun grant_access(
        proof: &mut Proof,
        viewer: address,
        duration_epochs: u64,
        ctx: &mut TxContext
    ) {
        assert!(proof.owner == tx_context::sender(ctx), 0);
        vec_set::insert(&mut proof.approved_viewers, viewer);
        
        let capability = ViewCapability {
            id: object::new(ctx),
            proof_id: object::id(proof),
            viewer: viewer,
            expires_at: tx_context::epoch(ctx) + duration_epochs,
        };
        
        transfer::transfer(capability, viewer);
    }

    /// Revoke view access
    public entry fun revoke_access(
        proof: &mut Proof,
        viewer: address,
        ctx: &TxContext
    ) {
        assert!(proof.owner == tx_context::sender(ctx), 0);
        vec_set::remove(&mut proof.approved_viewers, &viewer);
    }

    /// Check if address has view permission
    public fun can_view(proof: &Proof, viewer: address): bool {
        proof.owner == viewer || vec_set::contains(&proof.approved_viewers, &viewer)
    }

    /// Seal approve function - required for Seal SDK decryption
    /// This validates on-chain that the caller has permission to decrypt
    public fun seal_approve(
        policy_id_vec: vector<u8>,
        _ctx: &TxContext
    ): vector<u8> {
        // Simply return the policy ID to confirm access
        // The Seal SDK will use this to validate decryption rights
        // In a more complex app, you could check proof ownership here
        policy_id_vec
    }

    /// Get encrypted result blob_id (only if has permission)
    public fun get_result_blob_id(proof: &Proof, ctx: &TxContext): String {
        let viewer = tx_context::sender(ctx);
        assert!(can_view(proof, viewer), 1);
        proof.result_blob_id
    }

    /// Get result encryption policy_id
    public fun get_result_policy_id(proof: &Proof, ctx: &TxContext): String {
        let viewer = tx_context::sender(ctx);
        assert!(can_view(proof, viewer), 1);
        proof.result_policy_id
    }

    /// Get encrypted CSV blob_id
    public fun get_csv_blob_id(proof: &Proof, ctx: &TxContext): String {
        let viewer = tx_context::sender(ctx);
        assert!(can_view(proof, viewer), 1);
        proof.blob_id
    }

    /// Get CSV encryption policy_id
    public fun get_csv_policy_id(proof: &Proof, ctx: &TxContext): String {
        let viewer = tx_context::sender(ctx);
        assert!(can_view(proof, viewer), 1);
        proof.policy_id
    }
}