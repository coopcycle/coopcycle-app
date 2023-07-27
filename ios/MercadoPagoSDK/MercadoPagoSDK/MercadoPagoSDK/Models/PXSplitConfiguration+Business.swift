//
//  PXSplitConfiguration+Business.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 23/01/2019.
//

import Foundation

internal extension PXSplitConfiguration {

    func getSplitAmountToPay() -> Double {
        guard let amount = secondaryPaymentMethod?.amount else {
            return 0
        }
        if let discountAmountOff = secondaryPaymentMethod?.discount?.couponAmount {
            return amount - discountAmountOff
        } else {
            return amount
        }
    }
}
