import { SuiObjectChangeContext, SuiObjectTypeProcessor } from "@sentio/sdk/sui"
import { ChainId } from "@sentio/chain";
import { kiosk } from "./types/sui/0x2.js";
import { SuiObjectChange } from '@mysten/sui/client'
import { processObjectChanges } from "./utils/objectChangeProcessor.js";

import {MoveAccountFetchConfig } from '@sentio/protos'

const fetchConfig: MoveAccountFetchConfig = {
    owned: true
  }

export function KioskProcessor() {
    SuiObjectTypeProcessor.bind({
      objectType: kiosk.Kiosk.type(),
      network: ChainId.SUI_MAINNET
    })
    .onTimeInterval(async (self, _, ctx) => {
        ctx.eventLogger.emit("kiosk_owners", {
            owner: self.data_decoded.owner,
            profits: self.data_decoded.profits,
            item_count: self.data_decoded.item_count,
            id: self.data_decoded.id,
            allow_extensions: self.data_decoded.allow_extensions,
            // gas_payment: ctx.transaction.transaction?.data.gasData.payment, // 1/8/25currently not supported to get directly in processor through movefetchconfig method
        })
    }, undefined, 4800, fetchConfig)
    .onObjectChange((changes: SuiObjectChange[], ctx: SuiObjectChangeContext) => {
        processObjectChanges(changes, ctx, "kiosk_object_changes");
      });
  }