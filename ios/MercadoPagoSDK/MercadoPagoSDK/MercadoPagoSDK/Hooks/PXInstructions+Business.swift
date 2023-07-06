//
//  PXInstructions+Business.swift
//  MercadoPagoSDKV4
//
//  Created by Eden Torres on 27/08/2018.
//

import Foundation

/// :nodoc:
extension PXInstructions {
    open func hasSecundaryInformation() -> Bool {
        if instructions.isEmpty {
            return false
        } else {
            return instructions[0].hasSecondaryInformation()
        }
    }

    open func hasSubtitle() -> Bool {
        if instructions.isEmpty {
            return false
        } else {
            return instructions[0].hasSubtitle()
        }
    }

    internal func getInstruction() -> PXInstruction? {
        if instructions.isEmpty {
            return nil
        } else {
            return instructions[0]
        }
    }
}
