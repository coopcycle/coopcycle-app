//
//  PXOneTapItem+Business.swift
//  MercadoPagoSDKV4
//
//  Created by Eden Torres on 03/09/2018.
//

import Foundation

internal extension PXOneTapItem {
    func getPaymentOptionId() -> String {
        if let oneTapCard = oneTapCard {
            return oneTapCard.cardId
        }
        return paymentMethodId
    }
}
