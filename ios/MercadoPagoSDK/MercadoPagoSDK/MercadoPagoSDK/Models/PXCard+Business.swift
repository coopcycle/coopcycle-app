//
//  PXCard+Business.swift
//  MercadoPagoSDKV4
//
//  Created by Eden Torres on 03/09/2018.
//

import Foundation
/// :nodoc:
extension PXCard: PXCardInformation {
    internal func getIssuer() -> PXIssuer? {
        return issuer
    }

    internal func isSecurityCodeRequired() -> Bool {
        if securityCode != nil {
            if securityCode!.length != 0 {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }

    internal func getFirstSixDigits() -> String {
        return firstSixDigits ?? ""
    }

    internal func getCardDescription() -> String {
        return "terminada en".localized + " " + lastFourDigits!
    }

    internal func getPaymentMethod() -> PXPaymentMethod? {
        return self.paymentMethod
    }

    internal func getCardId() -> String {
        return id ?? ""
    }

    internal func getPaymentMethodId() -> String {
        return self.paymentMethod?.id ?? ""
    }

    internal func getPaymentTypeId() -> String {
        return self.paymentMethod?.paymentTypeId ?? ""
    }

    internal func getCardSecurityCode() -> PXSecurityCode? {
        return self.securityCode
    }

    internal func getCardBin() -> String? {
        return self.firstSixDigits
    }

    internal func getCardLastForDigits() -> String {
        return self.lastFourDigits ?? ""
    }

    internal func setupPaymentMethodSettings(_ settings: [PXSetting]) {
        self.paymentMethod?.settings = settings
    }

    internal func setupPaymentMethod(_ paymentMethod: PXPaymentMethod) {
        self.paymentMethod = paymentMethod
    }

    internal func isIssuerRequired() -> Bool {
        return self.issuer == nil
    }

    internal func canBeClone() -> Bool {
        return false
    }

}
/// :nodoc:
extension PXCard: PaymentOptionDrawable {
    func isDisabled() -> Bool {
        return false
    }

    func getTitle() -> String {
        return getCardDescription()
    }

    func getSubtitle() -> String? {
        return nil
    }

    func getImage() -> UIImage? {
        return ResourceManager.shared.getImageForPaymentMethod(withDescription: self.getPaymentMethodId())
    }
}
/// :nodoc:
extension PXCard: PaymentMethodOption {
    func getPaymentType() -> String {
        return paymentMethod?.paymentTypeId ?? ""
    }

    func getId() -> String {
        return String(describing: id)
    }

    func getChildren() -> [PaymentMethodOption]? {
        return nil
    }

    func hasChildren() -> Bool {
        return false
    }

    func isCard() -> Bool {
        return true
    }

    func isCustomerPaymentMethod() -> Bool {
        return true
    }

    func getDescription() -> String {
        return ""
    }

    func getComment() -> String {
        return ""
    }
}
