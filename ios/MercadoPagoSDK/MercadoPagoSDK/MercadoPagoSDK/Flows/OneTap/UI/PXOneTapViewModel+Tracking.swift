//
//  PXOneTapViewModel+Tracking.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 29/11/2018.
//

import Foundation
// MARK: Tracking
extension PXOneTapViewModel {
    func getAvailablePaymentMethodForTracking() -> [Any] {
        var dic: [Any] = []
        if let expressData = expressData {
            for expressItem in expressData where expressItem.newCard == nil {
                if expressItem.oneTapCard != nil {
                    dic.append(expressItem.getCardForTracking(amountHelper: amountHelper))
                } else if expressItem.accountMoney != nil {
                    dic.append(expressItem.getAccountMoneyForTracking())
                } else {
                    dic.append(expressItem.getPaymentMethodForTracking())
                }
            }
        }
        return dic
    }

    func getPaymentMethodsQuantityForTracking(enabled: Bool) -> Int {
        var availablePMQuantity = 0
        if let expressData = expressData {
            for expressItem in expressData where expressItem.status.enabled == enabled && expressItem.newCard == nil {
                availablePMQuantity += 1
            }
        }
        return availablePMQuantity
    }

    func getInstallmentsScreenProperties(installmentData: PXInstallment, selectedCard: PXCardSliderViewModel) -> [String: Any] {
        var properties: [String: Any] = [:]
        properties["payment_method_id"] = amountHelper.getPaymentData().paymentMethod?.id
        properties["payment_method_type"] = amountHelper.getPaymentData().paymentMethod?.paymentTypeId
        properties["card_id"] =  selectedCard.cardId
        if let issuerId = amountHelper.getPaymentData().issuer?.id {
            properties["issuer_id"] = Int64(issuerId)
        }
        var dic: [Any] = []
        for payerCost in installmentData.payerCosts {
            dic.append(payerCost.getPayerCostForTracking())
        }
        properties["available_installments"] = dic
        return properties
    }

    func getConfirmEventProperties(selectedCard: PXCardSliderViewModel, selectedIndex: Int) -> [String: Any] {
        guard let paymentMethod = amountHelper.getPaymentData().paymentMethod else {
            return [:]
        }
        let cardIdsEsc = PXTrackingStore.sharedInstance.getData(forKey: PXTrackingStore.cardIdsESC) as? [String] ?? []

        var properties: [String: Any] = [:]
        properties["payment_method_selected_index"] = selectedIndex
        if paymentMethod.isCard {
            properties["payment_method_type"] = paymentMethod.paymentTypeId
            properties["payment_method_id"] = paymentMethod.id
            properties["review_type"] = "one_tap"
            var extraInfo: [String: Any] = [:]
            extraInfo["card_id"] = selectedCard.cardId
            extraInfo["has_esc"] = cardIdsEsc.contains(selectedCard.cardId ?? "")
            extraInfo["selected_installment"] = amountHelper.getPaymentData().payerCost?.getPayerCostForTracking()
            if let issuerId = amountHelper.getPaymentData().issuer?.id {
                extraInfo["issuer_id"] = Int64(issuerId)
            }
            extraInfo["has_split"] = splitPaymentEnabled
            properties["extra_info"] = extraInfo
        } else {
            properties["payment_method_type"] = paymentMethod.id
            properties["payment_method_id"] = paymentMethod.id
            properties["review_type"] = "one_tap"
            var extraInfo: [String: Any] = [:]
            extraInfo["balance"] = selectedCard.accountMoneyBalance
            properties["extra_info"] = extraInfo
        }
        return properties
    }

    func getOneTapScreenProperties() -> [String: Any] {
        var properties: [String: Any] = [:]
        let availablePaymentMethods = getAvailablePaymentMethodForTracking()
        let availablePMQuantity = getPaymentMethodsQuantityForTracking(enabled: true)
        let disabledPMQuantity = getPaymentMethodsQuantityForTracking(enabled: false)
        properties["available_methods"] = availablePaymentMethods
        properties["available_methods_quantity"] = availablePMQuantity
        properties["disabled_methods_quantity"] = disabledPMQuantity
        properties["preference_amount"] = amountHelper.preferenceAmount
        properties["discount"] = amountHelper.getDiscountForTracking()

        var itemsDic: [Any] = []
        for item in amountHelper.preference.items {
            itemsDic.append(item.getItemForTracking())
        }
        properties["items"] = itemsDic
        return properties
    }

    func getErrorProperties(error: MPSDKError) -> [String: Any] {
        var properties: [String: Any] = [:]
        properties["path"] = TrackingPaths.Screens.OneTap.getOneTapPath()
        properties["style"] = Tracking.Style.snackbar
        properties["id"] = Tracking.Error.Id.genericError
        properties["message"] = "review_and_confirm_toast_error".localized
        properties["attributable_to"] = Tracking.Error.Atrributable.mercadopago
        var extraDic: [String: Any] = [:]
        extraDic["api_url"] =  error.requestOrigin
        properties["extra_info"] = extraDic
        return properties
    }
}
