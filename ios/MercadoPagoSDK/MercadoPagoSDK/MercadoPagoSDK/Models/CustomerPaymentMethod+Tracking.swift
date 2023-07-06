//
//  CustomerPaymentMethod+Tracking.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 13/12/2018.
//

import Foundation
// MARK: Tracking
extension CustomerPaymentMethod {
    func getCustomerPaymentMethodForTrancking() -> [String: Any] {
        let cardIdsEsc = PXTrackingStore.sharedInstance.getData(forKey: PXTrackingStore.cardIdsESC) as? [String] ?? []

        var savedCardDic: [String: Any] = [:]
        savedCardDic["payment_method_type"] = getPaymentTypeId()
        savedCardDic["payment_method_id"] = getPaymentMethodId()

        var extraInfo: [String: Any] = [:]
        extraInfo["card_id"] = getCardId()
        extraInfo["has_esc"] = cardIdsEsc.contains(getCardId())
        if let issuerId = getIssuer()?.id {
            extraInfo["issuer_id"] = Int(issuerId)
        }
        savedCardDic["extra_info"] = extraInfo
        return savedCardDic
    }
}
