//
//  CardFormViewModel.swift
//  MercadoPagoSDK
//
//  Created by Maria cristina rodriguez on 9/8/16.
//  Copyright © 2016 MercadoPago. All rights reserved.
//

import UIKit

private func < <T: Comparable>(lhs: T?, rhs: T?) -> Bool {
    switch (lhs, rhs) {
    case let (l__?, r__?):
        return l__ < r__
    case (nil, _?):
        return true
    default:
        return false
    }
}

internal class CardFormViewModel {

    var paymentMethods: [PXPaymentMethod]
    var guessedPMS: [PXPaymentMethod]?
    var customerCard: PXCardInformation?
    var token: PXToken?
    var cardToken: PXCardToken?

    let textMaskFormater = TextMaskFormater(mask: "XXXX XXXX XXXX XXXX")
    let textEditMaskFormater = TextMaskFormater(mask: "XXXX XXXX XXXX XXXX", completeEmptySpaces: false)

    var cvvEmpty: Bool = true
    var cardholderNameEmpty: Bool = true

    let animationDuration: Double = 0.6

    var promos: [PXBankDeal]?
    let mercadoPagoServicesAdapter: MercadoPagoServicesAdapter?

    internal var bankDealsEnabled: Bool = true

    init(paymentMethods: [PXPaymentMethod], guessedPaymentMethods: [PXPaymentMethod]? = nil, customerCard: PXCardInformation? = nil, token: PXToken? = nil, mercadoPagoServicesAdapter: MercadoPagoServicesAdapter?, bankDealsEnabled: Bool) {
        self.paymentMethods = paymentMethods
        self.guessedPMS = guessedPaymentMethods
        self.mercadoPagoServicesAdapter = mercadoPagoServicesAdapter
        self.bankDealsEnabled = bankDealsEnabled

        if customerCard != nil {
            self.customerCard = customerCard
            self.guessedPMS = [PXPaymentMethod]()
            self.guessedPMS?.append((customerCard?.getPaymentMethod())!)
        }
        self.token = token
    }

    func getPaymentMethodTypeId() -> String? {
        if paymentMethods.count == 0 {
            return nil
        }
        let paymentMethod = paymentMethods[0]
        if !Array.isNullOrEmpty(self.paymentMethods) {
            let filterArray = paymentMethods.filter { return $0.paymentTypeId != paymentMethod.paymentTypeId }
            return filterArray.isEmpty ? paymentMethod.paymentTypeId : nil
        } else {
            return nil
        }
    }

    func cvvLenght() -> Int {
        if let securityCode = customerCard?.getCardSecurityCode() {
            return  securityCode.length
        } else {
            guard let guessedPMFisrtSetting = getGuessedPM()?.settings.first else {
                return 3
            }
            return guessedPMFisrtSetting.securityCode?.length ?? 3
        }
    }

    func getLabelTextColor(cardNumber: String?) -> UIColor {
        if let cardNumber = cardNumber {
            if let bin = getBIN(cardNumber) {
                if let guessedPM = self.getGuessedPM() {
                    return (guessedPM.getFontColor(bin: bin))
                }
            }
        }
        return MPLabel.defaultColorText
    }

    func getEditingLabelColor(cardNumber: String?) -> UIColor {
        if let cardNumber = cardNumber {
            if let bin = getBIN(cardNumber) {
                if let guessedPM = self.getGuessedPM() {
                    return (guessedPM.getEditingFontColor(bin: bin))
                }
            }
        }
        return MPLabel.highlightedColorText
    }

    func getExpirationMonthFromLabel(_ expirationDateLabel: MPLabel) -> Int {
        return Utils.getExpirationMonthFromLabelText(expirationDateLabel.text!)
    }

    func getExpirationYearFromLabel(_ expirationDateLabel: MPLabel) -> Int {
        return Utils.getExpirationYearFromLabelText(expirationDateLabel.text!)
    }

    func getBIN(_ cardNumber: String) -> String? {
        if token != nil {
            return token?.firstSixDigits
        }

        var trimmedNumber = cardNumber.replacingOccurrences(of: " ", with: "")
        trimmedNumber = trimmedNumber.replacingOccurrences(of: String(textMaskFormater.emptyMaskElement), with: "")

        if trimmedNumber.count < 6 {
            return nil
        } else {
            let range = (trimmedNumber.index(trimmedNumber.startIndex, offsetBy: 6))
            let bin = String(trimmedNumber[..<range])
            return bin
        }
    }

    func isValidInputCVV(_ text: String) -> Bool {
        if text.count > self.cvvLenght() {
            return false
        }
        let num = Int(text)
        return (num != nil)
    }

    func validateCardNumber(_ cardNumberLabel: UILabel, expirationDateLabel: MPLabel, cvvLabel: UILabel, cardholderNameLabel: MPLabel) -> Bool {

        if self.guessedPMS == nil {
            return false
        }

        self.tokenHidratate(cardNumberLabel.text!, expirationDate: expirationDateLabel.text!, cvv: cvvLabel.text!, cardholderName: cardholderNameLabel.text!)

        let errorMethod = self.cardToken!.validateCardNumber(getGuessedPM()!)
        if (errorMethod) != nil {
            return false
        }
        return true
    }

    func validateCardholderName(_ cardNumberLabel: UILabel, expirationDateLabel: MPLabel, cvvLabel: UILabel, cardholderNameLabel: MPLabel) -> Bool {

        self.tokenHidratate(cardNumberLabel.text!, expirationDate: expirationDateLabel.text!, cvv: cvvLabel.text!, cardholderName: cardholderNameLabel.text!)

        if self.cardToken!.validateCardholderName() != nil {
            return false
        }
        return true
    }

    func validateCvv(_ cardNumberLabel: UILabel, expirationDateLabel: MPLabel, cvvLabel: UILabel, cardholderNameLabel: MPLabel) -> Bool {

        self.tokenHidratate(cardNumberLabel.text!, expirationDate: expirationDateLabel.text!, cvv: cvvLabel.text!, cardholderName: cardholderNameLabel.text!)

        if (cvvLabel.text!.replacingOccurrences(of: "•", with: "").count < self.getGuessedPM()?.secCodeLenght()) {
            return false
        }
        let errorMethod = self.cardToken!.validateSecurityCode()
        if (errorMethod) != nil {
            return false
        }
        return true
    }

    func validateExpirationDate(_ cardNumberLabel: UILabel, expirationDateLabel: MPLabel, cvvLabel: UILabel, cardholderNameLabel: MPLabel) -> Bool {

        self.tokenHidratate(cardNumberLabel.text!, expirationDate: expirationDateLabel.text!, cvv: cvvLabel.text!, cardholderName: cardholderNameLabel.text!)
        let errorMethod = self.cardToken!.validateExpiryDate()
        if (errorMethod) != nil {
            return false
        }
        return true
    }

    /*TODO : deberia validarse esto acá???*/
    func isAmexCard(_ cardNumber: String) -> Bool {
        if self.getBIN(cardNumber) == nil {
            return false
        }
        if self.guessedPMS != nil {
            return self.getGuessedPM()!.isAmex
        } else {
            return false
        }
    }

    func matchedPaymentMethod (_ cardNumber: String) -> [PXPaymentMethod]? {

        if self.guessedPMS != nil {
            return self.guessedPMS
        }

        if getBIN(cardNumber) == nil {
            return nil
        }

        var paymentMethods = [PXPaymentMethod]()

        for paymentMethod in self.paymentMethods {
            if paymentMethod.conformsToBIN(getBIN(cardNumber)!) {
                paymentMethods.append(paymentMethod.cloneWithBIN(getBIN(cardNumber)!)!)
            }
        }
        if paymentMethods.isEmpty {
            return nil
        } else {
            trackRecognizeCardEvent()
            return paymentMethods
        }

    }

    func tokenHidratate(_ cardNumber: String, expirationDate: String, cvv: String, cardholderName: String) {
        let number = cardNumber
        let year = Utils.getExpirationYearFromLabelText(expirationDate)
        let month = Utils.getExpirationMonthFromLabelText(expirationDate)
        let secCode = cvvEmpty ? "" :cvv
        let name = cardholderNameEmpty ? "" : cardholderName

        self.cardToken = PXCardToken(cardNumber: number, expirationMonth: month, expirationYear: year, securityCode: secCode, cardholderName: name, docType: "", docNumber: "")
    }

    func buildSavedCardToken(_ cvv: String) -> PXCardToken {
        let securityCode = self.customerCard!.isSecurityCodeRequired() ? cvv : ""
        self.cardToken = PXSavedCardToken(card: self.customerCard!, securityCode: securityCode, securityCodeRequired: self.customerCard!.isSecurityCodeRequired())
        return self.cardToken!
    }
    func getGuessedPM() -> PXPaymentMethod? {
        if let card = customerCard {
            return card.getPaymentMethod()
        } else {
            return guessedPMS?.first
        }
    }
    func hasGuessedPM() -> Bool {
        if guessedPMS == nil || guessedPMS?.count == 0 {
            return false
        } else {
            return true
        }
    }

    func showBankDeals() -> Bool {
        return !Array.isNullOrEmpty(self.promos) && bankDealsEnabled
    }

    func shoudShowOnlyOneCardMessage() -> Bool {
        return paymentMethods.count == 1
    }

    func getOnlyOneCardAvailableMessage() -> String {
        let defaultMessage = "Método de pago no soportado".localized
        if Array.isNullOrEmpty(paymentMethods) {
            return defaultMessage
        }
        if let paymentMethodName = paymentMethods[0].name, !String.isNullOrEmpty(paymentMethodName) {
            let message = "Solo puedes pagar con {0}".localized
            return String(format: message, paymentMethodName).replacingOccurrences(of: "{0}", with: paymentMethodName)
        } else {
            return defaultMessage
        }
    }
}

// MARK: Tracking
extension CardFormViewModel {
    func trackRecognizeCardEvent() {
        if getPaymentMethodTypeId() != nil {
            var properties: [String: Any] = [:]
            properties["payment_method_id"] = paymentMethods.first?.id
            MPXTracker.sharedInstance.trackEvent(path: TrackingPaths.Events.getRecognizedCardPath(), properties: properties)
        }
    }
}
