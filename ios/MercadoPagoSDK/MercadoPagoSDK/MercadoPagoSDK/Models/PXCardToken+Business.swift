//
//  PXCardToken+Business.swift
//  MercadoPagoSDKV4
//
//  Created by Eden Torres on 04/09/2018.
//

import Foundation
/// :nodoc:
extension PXCardToken: PXCardInformationForm {
    func getCardLastForDigits() -> String {
        guard let cardNumber = cardNumber else {
            return ""
        }
        let index = cardNumber.count
        return String(cardNumber[cardNumber.index(cardNumber.startIndex, offsetBy: index-4)...cardNumber.index(cardNumber.startIndex, offsetBy: index - 1)])
    }
    func getCardBin() -> String? {
        return getBin()
    }

    func isIssuerRequired() -> Bool {
        return true
    }

    func canBeClone() -> Bool {
        return false
    }
}
/// :nodoc:
extension PXCardToken {
    func normalizeCardNumber(_ number: String?) -> String? {
        guard let number = number else {
            return nil
        }
        return number.trimmingCharacters(in: CharacterSet.whitespaces).replacingOccurrences(of: "\\s+|-", with: "")
    }

    @objc func validate() -> Bool {
        return validate(true)
    }

    func validate(_ includeSecurityCode: Bool) -> Bool {
        var result: Bool = validateCardNumber() == nil && validateExpiryDate() == nil && validateIdentification() == nil && validateCardholderName() == nil
        if includeSecurityCode {
            result = result && validateSecurityCode() == nil
        }
        return result
    }

    func validateCardNumber() -> String? {
        if String.isNullOrEmpty(cardNumber) {
            return "Ingresa el número de la tarjeta de crédito".localized
        } else if self.cardNumber!.count < MIN_LENGTH_NUMBER || self.cardNumber!.count > MAX_LENGTH_NUMBER {
            return "invalid_field".localized
        } else {
            return nil
        }
    }

    func validateCardNumber(_ paymentMethod: PXPaymentMethod) -> String? {
        var userInfo: [String: String]?
        cardNumber = cardNumber?.replacingOccurrences(of: "•", with: "")
        let validCardNumber = self.validateCardNumber()
        if validCardNumber != nil {
            return validCardNumber
        } else {

            let settings: [PXSetting]? = PXSetting.getSettingByBin(paymentMethod.settings, bin: getBin())

            guard let cardSettings = settings, !Array.isNullOrEmpty(settings) else {
                if userInfo == nil {
                    userInfo = [String: String]()
                }
                return "El número de tarjeta que ingresaste no se corresponde con el tipo de tarjeta".localized
            }

            // Validate card length
            let filteredSettings = settings?.filter({ return $0.cardNumber?.length == cardNumber!.trimSpaces().count })

            if Array.isNullOrEmpty(filteredSettings) {
                if userInfo == nil {
                    userInfo = [String: String]()
                }
                if cardSettings.count > 1 {
                    return "invalid_card_length_general".localized
                } else {
                    return ("invalid_card_length".localized as NSString).replacingOccurrences(of: "{0}", with: "\(cardSettings[0].cardNumber?.length ?? 0)")
                }
            }
            // Validate luhn
            if "standard" == cardSettings[0].cardNumber?.validation && !checkLuhn(cardNumber: (cardNumber?.trimSpaces())!) {
                if userInfo == nil {
                    userInfo = [String: String]()
                }
                return "El número de tarjeta que ingresaste es incorrecto".localized
                //   userInfo?.updateValue("El número de tarjeta que ingresaste es incorrecto".localized, forKey: "cardNumber")
            }
        }

        if userInfo == nil {
            return nil
        } else {
            return "El número de tarjeta que ingresaste no se corresponde con el tipo de tarjeta".localized
            //   return NSError(domain: "mercadopago.sdk.card.error", code: 1, userInfo: userInfo)
        }
    }

    func validateSecurityCode() -> String? {
        return validateSecurityCode(securityCode)
    }

    func validateSecurityCode(_ securityCode: String?) -> String? {
        if String.isNullOrEmpty(self.securityCode) || self.securityCode!.count < 3 || self.securityCode!.count > 4 {
            return "invalid_field".localized
            //  return NSError(domain: "mercadopago.sdk.card.error", code: 1, userInfo: ["securityCode" : "invalid_field".localized])
        } else {
            return nil
        }
    }

    func validateSecurityCodeWithPaymentMethod(_ paymentMethod: PXPaymentMethod) -> String? {

        guard let cardNumber = cardNumber else {
            return nil
        }
        if cardNumber.count < 6 {
            return nil
        }
        let validSecurityCode = self.validateSecurityCode(securityCode)
        if validSecurityCode != nil {
            return validSecurityCode
        } else {
            let range = cardNumber.startIndex ..< cardNumber.index(cardNumber.startIndex, offsetBy: 6)
            return validateSecurityCodeWithPaymentMethod(securityCode!, paymentMethod: paymentMethod, bin: String(cardNumber[range]))
        }
    }

    func validateSecurityCodeWithPaymentMethod(_ securityCode: String, paymentMethod: PXPaymentMethod, bin: String) -> String? {
        let setting: [PXSetting]? = PXSetting.getSettingByBin(paymentMethod.settings, bin: getBin())
        if let settings = setting {
            let cvvLength = settings[0].securityCode?.length ?? 3
            if (cvvLength != 0) && (securityCode.count != cvvLength) {
                return ("invalid_cvv_length".localized as NSString).replacingOccurrences(of: "{0}", with: "\(cvvLength)")
            } else {
                return nil
            }
        }
        return nil
    }

    func validateExpiryDate() -> String? {
        return validateExpiryDate(expirationMonth, year: expirationYear)
    }

    func validateExpiryDate(_ month: Int, year: Int) -> String? {
        if !validateExpMonth(month) {
            return "invalid_field".localized
        }
        if !validateExpYear(year) {
            return "invalid_field".localized
        }

        if hasMonthPassed(self.expirationYear, month: self.expirationMonth) {
            return "invalid_field".localized
        }

        return nil
    }

    func validateExpMonth(_ month: Int) -> Bool {
        return (month >= 1 && month <= 12)
    }

    func validateExpYear(_ year: Int) -> Bool {
        return !hasYearPassed(year)
    }

    func validateIdentification() -> String? {

        let validType = validateIdentificationType()
        if validType != nil {
            return validType
        } else {
            let validNumber = validateIdentificationNumber()
            if validNumber != nil {
                return validNumber
            }
        }
        return nil
    }

    func validateIdentificationType() -> String? {

        if String.isNullOrEmpty(cardholder!.identification!.type) {
            return "invalid_field".localized
        } else {
            return nil
        }
    }

    func validateIdentificationNumber() -> String? {

        if String.isNullOrEmpty(cardholder!.identification!.number) {
            return "invalid_field".localized
        } else {
            return nil
        }
    }

    func validateIdentificationNumber(_ identificationType: PXIdentificationType?) -> String? {
        if identificationType != nil {
            if cardholder?.identification != nil && cardholder?.identification?.number != nil {
                let len = cardholder!.identification!.number!.count
                let min = identificationType!.minLength
                let max = identificationType!.maxLength
                if min != 0 && max != 0 {
                    if len > max || len < min {
                        return "invalid_field".localized
                    } else {
                        if identificationType!.validate(identification: cardholder?.identification?.number ?? "") {
                            return nil
                        } else {
                            return "invalid_field".localized
                        }
                    }
                } else {
                    return validateIdentificationNumber()
                }
            } else {
                return "invalid_field".localized
            }
        } else {
            return validateIdentificationNumber()
        }
    }

    func validateCardholderName() -> String? {
        if String.isNullOrEmpty(self.cardholder?.name) {
            return "invalid_field".localized
            // return NSError(domain: "mercadopago.sdk.card.error", code: 1, userInfo: ["cardholder" : "invalid_field".localized])
        } else {
            return nil
        }
    }

    func hasYearPassed(_ year: Int) -> Bool {
        let normalized: Int = normalizeYear(year)
        return normalized < now.year!
    }

    func hasMonthPassed(_ year: Int, month: Int) -> Bool {
        return hasYearPassed(year) || normalizeYear(year) == now.year! && month < (now.month!)
    }

    func normalizeYear(_ year: Int) -> Int {
        if year < 100 && year >= 0 {
            let currentYear: String = String(describing: now.year)
            let range = currentYear.startIndex ..< currentYear.index(currentYear.endIndex, offsetBy: -2)
            let prefix: String = String(currentYear[range])

            let nsReturn: NSString = prefix.appending(String(year)) as NSString
            return nsReturn.integerValue
        }
        return year
    }

    func checkLuhn(cardNumber: String) -> Bool {
        var sum = 0
        let reversedCharacters = cardNumber.reversed().map { String($0) }
        for (idx, element) in reversedCharacters.enumerated() {
            guard let digit = Int(element) else { return false }
            switch ((idx % 2 == 1), digit) {
            case (true, 9): sum += 9
            case (true, 0...8): sum += (digit * 2) % 9
            default: sum += digit

            }
        }
        return sum % 10 == 0
    }

    func getBin() -> String? {
        let range = cardNumber!.startIndex ..< cardNumber!.index(cardNumber!.startIndex, offsetBy: 6)
        let bin: String? = cardNumber!.count >= 6 ? String(cardNumber![range]) : nil
        return bin
    }

    func getNumberFormated() -> NSString {

        //TODO AMEX
        var str: String
        str = (cardNumber?.insert(" ", ind: 12))!
        str = (str.insert(" ", ind: 8))
        str = (str.insert(" ", ind: 4))
        str = (str.insert(" ", ind: 0))
        return str as NSString
    }

    func getExpirationDateFormated() -> String {

        let expirationMonth = self.expirationMonth.stringValue
        let expirationYear = self.expirationYear.stringValue

        let range = expirationYear.index(before: expirationYear.index(before: expirationYear.endIndex))
        let expirationDateFormatted = expirationMonth + "/" + String(expirationYear[range...])

        return expirationDateFormatted
    }

    @objc func isCustomerPaymentMethod() -> Bool {
        return false
    }
}
