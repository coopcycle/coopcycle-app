//
//  SecurityCodeViewModel.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 7/17/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

internal class SecurityCodeViewModel {
    var paymentMethod: PXPaymentMethod!
    var cardInfo: PXCardInformationForm!
    var reason: Reason

    var callback: ((_ cardInformation: PXCardInformationForm, _ securityCode: String) -> Void)?

    public init(paymentMethod: PXPaymentMethod, cardInfo: PXCardInformationForm, reason: Reason) {
        self.paymentMethod = paymentMethod
        self.cardInfo = cardInfo
        self.reason = reason
    }

    func secCodeInBack() -> Bool {
        return paymentMethod.secCodeInBack()
    }
    func secCodeLenght() -> Int {
        return paymentMethod.secCodeLenght(cardInfo.getCardBin())
    }

    func executeCallback(secCode: String!) {
        callback!(cardInfo, secCode)
    }

    func getPaymentMethodColor() -> UIColor {
        return self.paymentMethod.getColor(bin: self.cardInfo.getCardBin())
    }

    func getPaymentMethodFontColor() -> UIColor {
        return self.paymentMethod.getFontColor(bin: self.cardInfo.getCardBin())
    }

    func getCardHeight() -> CGFloat {
        return getCardWidth() / 12 * 7
    }

    func getCardWidth() -> CGFloat {
        return (UIScreen.main.bounds.width - 100)
    }
    func getCardX() -> CGFloat {
        return ((UIScreen.main.bounds.width - getCardWidth()) / 2)
    }

    func getCardY() -> CGFloat {
        let cardSeparation: CGFloat = 510
        let yPos = (UIScreen.main.bounds.height - getCardHeight() - cardSeparation) / 2
        return yPos > 10 ? yPos : 10
    }

    func getCardBounds() -> CGRect {
        return CGRect(x: getCardX(), y: getCardY(), width: getCardWidth(), height: getCardHeight())
    }

    internal enum Reason: String {
        case INVALID_ESC = "esc_cap"
        case CALL_FOR_AUTH = "call_for_auth"
        case SAVED_CARD = "saved_card"
    }
}

// MARK: Tracking
extension SecurityCodeViewModel {
    func getScreenProperties() -> [String: Any] {
        var properties: [String: Any] = [:]
        properties["payment_method_id"] = paymentMethod.getPaymentIdForTracking()
        if let token = cardInfo as? PXCardInformation {
            properties["card_id"] =  token.getCardId()
        }
        properties["reason"] = reason.rawValue
        return properties
    }

    func getInvalidUserInputErrorProperties(message: String) -> [String: Any] {
        var properties: [String: Any] = [:]
        properties["path"] = TrackingPaths.Screens.getSecurityCodePath(paymentTypeId: paymentMethod.paymentTypeId)
        properties["style"] = Tracking.Style.customComponent
        properties["id"] = Tracking.Error.Id.invalidCVV
        properties["message"] = message
        properties["attributable_to"] = Tracking.Error.Atrributable.user
        var extraDic: [String: Any] = [:]
        extraDic["payment_method_type"] = paymentMethod?.getPaymentTypeForTracking()
        extraDic["payment_method_id"] = paymentMethod?.getPaymentIdForTracking()
        properties["extra_info"] = extraDic
        return properties
    }
}
