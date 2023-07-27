//
//  PXPayerCost+Business.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 26/07/2018.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

extension PXPayerCost: Cellable {
    var objectType: ObjectTypes {
        get {
            return ObjectTypes.payerCost
        }
        set {
            self.objectType = ObjectTypes.payerCost
        }
    }

    func hasInstallmentsRate() -> Bool {
        return installmentRate > 0.0 && installments > 1
    }

    func hasCFTValue() -> Bool {
        return !String.isNullOrEmpty(getCFTValue())
    }

    func getCFTValue() -> String? {
        for label in labels {
            let values = label.components(separatedBy: "|")
            for value in values {
                if let range = value.range(of: "CFT_") {
                    return String(value[range.upperBound...])
                }
            }
        }
        return nil
    }

    func getTEAValue() -> String? {
        for label in labels {
            let values = label.components(separatedBy: "|")
            for value in values {
                if let range = value.range(of: "TEA_") {
                    return String(value[range.upperBound...])
                }
            }
        }
        return nil
    }

    func getPayerCostForTracking() -> [String: Any] {
        var installmentDic: [String: Any] = [:]
        installmentDic["quantity"] = installments
        installmentDic["installment_amount"] = installmentAmount
        installmentDic["interest_rate"] = installmentRate
        if hasInstallmentsRate() {
            installmentDic["visible_total_price"] = totalAmount
        }
        return installmentDic
    }
}
