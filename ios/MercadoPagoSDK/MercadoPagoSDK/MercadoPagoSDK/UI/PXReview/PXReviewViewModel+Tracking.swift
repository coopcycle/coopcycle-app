//
//  PXReviewViewModel+Tracking.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 03/12/2018.
//

import Foundation

// MARK: Tracking
extension PXReviewViewModel {

    func getConfirmEventProperties() -> [String: Any] {
        var properties: [String: Any] = amountHelper.getPaymentData().getPaymentDataForTracking()
        properties["review_type"] = "traditional"
        return properties
    }

    func getScreenProperties() -> [String: Any] {
        var properties: [String: Any] = amountHelper.getPaymentData().getPaymentDataForTracking()

        properties["discount"] = amountHelper.getDiscountForTracking()
        properties["preference_amount"] = amountHelper.preferenceAmount
        var itemsDic: [Any] = []
        for item in amountHelper.preference.items {
            itemsDic.append(item.getItemForTracking())
        }
        properties["items"] = itemsDic
        return properties
    }
}
