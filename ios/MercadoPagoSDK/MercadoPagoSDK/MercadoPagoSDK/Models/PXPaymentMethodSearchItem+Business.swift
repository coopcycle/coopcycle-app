//
//  PXPaymentMethodSearchItem.swift
//  MercadoPagoSDKV4
//
//  Created by Eden Torres on 03/09/2018.
//

import Foundation

internal extension PXPaymentMethodSearchItem {
    func isOfflinePayment() -> Bool {
        return PXPaymentTypes.offlinePaymentTypes().contains(id)
    }

    func isPaymentMethod() -> Bool {
        return self.type == PXPaymentMethodSearchItemType.PAYMENT_METHOD.rawValue
    }

    func isPaymentType() -> Bool {
        return self.type == PXPaymentMethodSearchItemType.PAYMENT_TYPE.rawValue
    }

}

extension PXPaymentMethodSearchItem: PaymentOptionDrawable {
    func isDisabled() -> Bool {
        return false
    }

    func getTitle() -> String {
        return _description ?? ""
    }

    func getSubtitle() -> String? {
        if id == PXPaymentTypes.CREDIT_CARD.rawValue || id == PXPaymentTypes.DEBIT_CARD.rawValue || id == PXPaymentTypes.PREPAID_CARD.rawValue {
            return nil
        }
        return comment
    }

    func getImage() -> UIImage? {
        return ResourceManager.shared.getImageForPaymentMethod(withDescription: id)
    }
}

extension PXPaymentMethodSearchItem: PaymentMethodOption {
    func getPaymentType() -> String {
        return type ?? ""
    }

    func hasChildren() -> Bool {
        return !Array.isNullOrEmpty(self.children)
    }

    func getChildren() -> [PaymentMethodOption]? {
        return children
    }

    func isCard() -> Bool {
        return PXPaymentTypes.isCard(paymentTypeId: id.lowercased())
    }

    func getId() -> String {
        return id
    }

    func isCustomerPaymentMethod() -> Bool {
        return false
    }

    func getDescription() -> String {
        return _description ?? ""
    }

    func getComment() -> String {
        return comment ?? ""
    }
}
