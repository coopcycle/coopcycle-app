//
//  PaymentVaultViewModel+Tracking.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 26/11/2018.
//

import Foundation
// MARK: Tracking
extension PaymentVaultViewModel {
    func getAvailablePaymentMethodForTracking() -> [Any] {
        var dic: [Any] = []
        if isRoot {
            if let customerPaymentOptions = customerPaymentOptions {
                for savedCard: CustomerPaymentMethod in customerPaymentOptions {
                    dic.append(savedCard.getCustomerPaymentMethodForTrancking())
                }
            }
        }
        for paymentOption in paymentMethodOptions {
            var paymentOptionDic: [String: Any] = [:]
            if paymentOption.getPaymentType() == PXPaymentMethodSearchItemTypes.PAYMENT_METHOD {
                let filterPaymentMethods = paymentMethods.filter { paymentOption.getId().startsWith($0.id) }
                if let paymentMethod = filterPaymentMethods.first {
                    paymentOptionDic["payment_method_id"] = paymentOption.getId()
                    paymentOptionDic["payment_method_type"] = paymentMethod.paymentTypeId
                }
            } else {
                paymentOptionDic["payment_method_type"] = paymentOption.getId()
            }
            dic.append(paymentOptionDic)
        }
        return dic
    }

    func getScreenProperties() -> [String: Any] {
        var properties: [String: Any] = ["discount": amountHelper.getDiscountForTracking()]
        let availablePaymentMethods = getAvailablePaymentMethodForTracking()
        properties["preference_amount"] = amountHelper.preferenceAmount
        properties["available_methods"] = availablePaymentMethods
        properties["available_methods_quantity"] = availablePaymentMethods.count
        var itemsDic: [Any] = []
        for item in amountHelper.preference.items {
            itemsDic.append(item.getItemForTracking())
        }
        properties["items"] = itemsDic
        return properties
    }

    func getScreenPath() -> String {
        var screenPath = TrackingPaths.Screens.PaymentVault.getPaymentVaultPath()
        if let groupName = groupName {
            if groupName == PXPaymentTypes.BANK_TRANSFER.rawValue || groupName == PXPaymentTypes.TICKET.rawValue || groupName == PXPaymentTypes.BOLBRADESCO.rawValue {
                screenPath = TrackingPaths.Screens.PaymentVault.getTicketPath()
            } else {
                screenPath = TrackingPaths.Screens.PaymentVault.getCardTypePath()
            }
        }
        return screenPath
    }
}
