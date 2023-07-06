//
//  PXReceiptViewModelHelper.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 1/5/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

internal extension PXResultViewModel {
    func hasReceiptComponent() -> Bool {
        if self.paymentResult.paymentId == nil {
            return false
        }
        if paymentResult.isApproved() {
            let isPaymentMethodPlugin = self.paymentResult.paymentData?.getPaymentMethod()?.paymentTypeId == PXPaymentTypes.PAYMENT_METHOD_PLUGIN.rawValue

            if isPaymentMethodPlugin {
                let hasReceiptId = !String.isNullOrEmpty(self.paymentResult.paymentId)
                if hasReceiptId {
                    return true
                }
            } else if !self.preference.isPaymentIdDisable() {
                return true
            }
        }
        return false
    }
}
