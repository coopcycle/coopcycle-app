//
//  PXToken+Business.swift
//  MercadoPagoSDKV4
//
//  Created by Eden Torres on 01/08/2018.
//

import Foundation

/// :nodoc:
extension PXToken: PXCardInformationForm {
    func getBin() -> String? {
        var bin: String?
        if firstSixDigits.count > 0 {
            let range = firstSixDigits.startIndex ..< firstSixDigits.index(firstSixDigits.startIndex, offsetBy: 6)
            bin = firstSixDigits.count >= 6 ? String(firstSixDigits[range]) : nil
        }

        return bin
    }

    func getCardExpirationDateFormated() -> String {
        return (String(expirationMonth) + String(expirationYear))
    }

    func getMaskNumber() -> String {

        var masknumber: String = ""

        for _ in 0...cardNumberLength - 4 {
            masknumber += "X"
        }

        masknumber += lastFourDigits
        return masknumber

    }

    func getExpirationDateFormated() -> String {
        if self.expirationYear > 0 && self.expirationMonth > 0 {

            let expirationMonth = self.expirationMonth.stringValue
            let expirationYear = self.expirationYear.stringValue

            let range = expirationYear.index(before: expirationYear.index(before: expirationYear.endIndex))

            return expirationMonth + "/" + String(expirationYear[range...])
        }
        return ""
    }

    public func getCardBin() -> String? {
        return firstSixDigits
    }

    public func getCardLastForDigits() -> String {
        return lastFourDigits
    }

    public func isIssuerRequired() -> Bool {
        return true
    }

    public func canBeClone() -> Bool {
        return true
    }

    func hasESC() -> Bool {
        return !String.isNullOrEmpty(esc)
    }

    func hasCardId() -> Bool {
        return !String.isNullOrEmpty(cardId)
    }
}
