//
//  PXInstruction+Business.swift
//  MercadoPagoSDKV4
//
//  Created by Eden Torres on 27/08/2018.
//

import Foundation

extension PXInstruction {
    func hasSubtitle() -> Bool {
        return !String.isNullOrEmpty(subtitle)
    }

    func hasTitle() -> Bool {
        return !String.isNullOrEmpty(title)
    }

    func hasAccreditationMessage() -> Bool {
        return !String.isNullOrEmpty(accreditationMessage)
    }

    func hasSecondaryInformation() -> Bool {
        return !Array.isNullOrEmpty(secondaryInfo)
    }

    func hasAccreditationComment() -> Bool {
        return !Array.isNullOrEmpty(accreditationComments)
    }

    func hasActions() -> Bool {
        return !Array.isNullOrEmpty(actions)
    }
}
