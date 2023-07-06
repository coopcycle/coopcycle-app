//
//  PXCustomOptionSearchItem+Business.swift
//  MercadoPagoSDKV4
//
//  Created by Eden Torres on 03/09/2018.
//

import Foundation
internal extension PXCustomOptionSearchItem {
    func getCustomerPaymentMethod() -> CustomerPaymentMethod {
        return CustomerPaymentMethod(id: id, paymentMethodId: paymentMethodId ?? "", paymentMethodTypeId: paymentTypeId ?? "", description: _description ?? "", issuer: issuer, firstSixDigits: firstSixDigits, lastFourDigits: lastFourDigits)
    }
}
