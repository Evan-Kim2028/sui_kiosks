import { SuiObjectChange } from '@mysten/sui/client';
import { SuiObjectChangeContext } from "@sentio/sdk/sui";

/**
 * Processes an array of Sui object changes and emits events for tracking.
 * 
 * @param changes - Array of SuiObjectChange to process
 * @param ctx - Context object for handling Sui object changes
 * @param eventName - Optional name for the emitted event (defaults to "object_changes")
 * 
 * @remarks
 * This function processes 'transferred', 'mutated', and 'created' change types.
 * For each valid change, it emits an event with the object's details including
 * ownership information.
 */
export function processObjectChanges(
  changes: SuiObjectChange[], 
  ctx: SuiObjectChangeContext,
  eventName: string = "object_changes"
) {
  console.log(`Processing ${changes.length} object changes`);
  
  changes.forEach(change => {
    console.log('Change details:', {
      type: change.type,
      fullChange: change
    });
    
    if (change.type === 'transferred' || change.type === 'mutated' || change.type === 'created') {
      console.log('Processing change:', {
        digest: change.digest, // NOTE 1/3/25: the digest is wrong. There is another column called transaction_hash that gets automatically added on later that is the correct digest.
        objectId: change.objectId,
        objectType: change.objectType,
        owner: change.type === 'transferred' ? change.recipient : change.owner,
        type: change.type,
        sender: change.sender,
        version: change.version,
      });
      
      ctx.eventLogger.emit(eventName, {
        digest: change.digest,
        object_id: change.objectId,
        objectType: change.objectType,
        type: change.type,
        sender: change.sender,
        version: change.version,
        owner: change.type === 'transferred' ? change.recipient : change.owner,
        previous_owner: change.type === 'transferred' ? change.sender : change.owner
      });
    } else {
      console.log('Skipped change type:', change.type);
    }
  });
} 