//
//  PXPaymentMethod+Business.swift
//  MercadoPagoSDKV4
//
//  Created by Eden Torres on 30/07/2018.
//

import Foundation

/// :nodoc:
extension PXPaymentMethod: Cellable {
    var objectType: ObjectTypes {
        get {
            return ObjectTypes.paymentMethod
        }
        set {
            self.objectType = ObjectTypes.paymentMethod
        }
    }

    internal var isIssuerRequired: Bool {
        return isAdditionalInfoNeeded("issuer_id")
    }

    internal var isIdentificationRequired: Bool {
        if isAdditionalInfoNeeded("cardholder_identification_number") || isAdditionalInfoNeeded("identification_number") || isEntityTypeRequired {
            return true
        }
        return false
    }
    internal var isIdentificationTypeRequired: Bool {
        if isAdditionalInfoNeeded("cardholder_identification_type") || isAdditionalInfoNeeded("identification_type") || isEntityTypeRequired {
            return true
        }
        return false
    }

    internal var isPayerInfoRequired: Bool {
        if isAdditionalInfoNeeded("bolbradesco_name") || isAdditionalInfoNeeded("bolbradesco_identification_type") || isAdditionalInfoNeeded("bolbradesco_identification_number")
            || isAdditionalInfoNeeded("pec_name") || isAdditionalInfoNeeded("pec_identification_type") || isAdditionalInfoNeeded("pec_identification_number") {
            return true
        }
        return false
    }

    internal var isEntityTypeRequired: Bool {
        return isAdditionalInfoNeeded("entity_type")
    }

    internal var isDigitalCurrency: Bool {
        if let paymentTypeId = PXPaymentTypes(rawValue: self.paymentTypeId) {
            return paymentTypeId.isDigitalCurrency()
        }
        return false
    }

    internal var isCard: Bool {
        if let paymentTypeId = PXPaymentTypes(rawValue: self.paymentTypeId) {
            return paymentTypeId.isCard()
        }
        return false
    }

    internal var isCreditCard: Bool {
        if let paymentTypeId = PXPaymentTypes(rawValue: self.paymentTypeId) {
            return paymentTypeId.isCreditCard()
        }
        return false

    }

    internal var isPrepaidCard: Bool {
        if let paymentTypeId = PXPaymentTypes(rawValue: self.paymentTypeId) {
            return paymentTypeId.isPrepaidCard()
        }
        return false
    }

    internal var isDebitCard: Bool {
        if let paymentTypeId = PXPaymentTypes(rawValue: self.paymentTypeId) {
            return paymentTypeId.isDebitCard()
        }
        return false
    }

    internal func isSecurityCodeRequired(_ bin: String) -> Bool {
        let settings: [PXSetting]? = PXSetting.getSettingByBin(self.settings, bin: bin)
        if let setting = settings?.first, let securityCode = setting.securityCode {
            if securityCode.length != 0 {
                return true
            }
        }
        return false
    }

    internal func isAdditionalInfoNeeded(_ param: String!) -> Bool {
        if let additionalInfoNeeded = additionalInfoNeeded {
            for info in additionalInfoNeeded where info == param {
                return true
            }
        }
        return false
    }

    internal func conformsToBIN(_ bin: String) -> Bool {
        return (PXSetting.getSettingByBin(self.settings, bin: bin) != nil)
    }
    internal func cloneWithBIN(_ bin: String) -> PXPaymentMethod? {
        guard let setting = PXSetting.getSettingByBin(settings, bin: bin) else {
            return nil
        }
        let paymentMethod: PXPaymentMethod = PXPaymentMethod(additionalInfoNeeded: additionalInfoNeeded, id: id, name: name, paymentTypeId: paymentTypeId, status: status, secureThumbnail: secureThumbnail, thumbnail: thumbnail, deferredCapture: deferredCapture, settings: setting, minAllowedAmount: minAllowedAmount, maxAllowedAmount: maxAllowedAmount, accreditationTime: accreditationTime, merchantAccountId: merchantAccountId, financialInstitutions: financialInstitutions, description: paymentMethodDescription, processingModes: processingModes)
        paymentMethod.id = id
        paymentMethod.name = self.name
        paymentMethod.paymentTypeId = self.paymentTypeId
        paymentMethod.additionalInfoNeeded = self.additionalInfoNeeded
        return paymentMethod
    }

    internal var isAmex: Bool {
        return self.id == "amex"
    }

    internal var isAccountMoney: Bool {
        return self.id == PXPaymentTypes.ACCOUNT_MONEY.rawValue
    }

    internal func secCodeMandatory() -> Bool {
        guard let firstSetting = settings.first, let firstSettingMode = firstSetting.securityCode?.mode  else {
            return false //Si no tiene settings el codigo de seguridad no es mandatorio
        }
        let filterList = settings.filter({ return $0.securityCode?.mode == firstSettingMode })
        if filterList.count == self.settings.count {
            return firstSetting.securityCode?.mode == "mandatory"
        } else {
            return true // si para alguna de sus settings es mandatorio entonces el codigo es mandatorio
        }
    }

    internal func secCodeLenght(_ bin: String? = nil) -> Int {
        if let bin = bin {
            var binSettings: [PXSetting]?
            binSettings = PXSetting.getSettingByBin(self.settings, bin: bin)
            if let firstSetting = binSettings?.first {
                return firstSetting.securityCode?.length ?? 3
            }
        }
        if let setting = settings.first, let securityCode = setting.securityCode {
            return securityCode.length
        }
        return 3
    }

    open func cardNumberLenght() -> Int {
        guard let firstSetting = settings.first, let firstSettingCardLength = firstSetting.cardNumber?.length else {
            return 0 //Si no tiene settings la longitud es cero
        }

        let filterList = settings.filter({ return $0.cardNumber?.length == firstSettingCardLength })
        if filterList.count == self.settings.count {
            return firstSettingCardLength
        } else {
            return 0 //si la longitud de sus numberos, en sus settings no es siempre la misma entonces responde 0
        }
    }

    open func secCodeInBack() -> Bool {
        guard let firstSetting = settings.first, let firstSettingCardLocation = firstSetting.securityCode?.cardLocation else {
            return true //si no tiene settings, por defecto el codigo de seguridad ira atras
        }

        let filterList = settings.filter({ return $0.securityCode?.cardLocation == firstSettingCardLocation })
        if filterList.count == self.settings.count {
            return firstSettingCardLocation == "back"
        } else {
            return true //si sus settings no coinciden el codigo ira atras por default
        }
    }

    open var isOnlinePaymentMethod: Bool {
        return self.isCard || self.isAccountMoney || self.isDigitalCurrency
    }

    internal func conformsPaymentPreferences(_ paymentPreference: PXPaymentPreference?) -> Bool {

        if paymentPreference == nil {
            return true
        }
        if paymentPreference!.defaultPaymentMethodId != nil {
            if id != paymentPreference!.defaultPaymentMethodId {
                return false
            }
        }
        if let excludedPaymentTypeIds = paymentPreference?.excludedPaymentTypeIds {
            for excludedPaymentType in excludedPaymentTypeIds where excludedPaymentType == self.paymentTypeId {
                return false
            }
        }

        if let excludedPaymentMethodIds = paymentPreference?.excludedPaymentMethodIds {
            for excludedPaymentMethodId  in excludedPaymentMethodIds where excludedPaymentMethodId == id {
                return false
            }
        }

        if paymentPreference!.defaultPaymentTypeId != nil {
            if paymentPreference!.defaultPaymentTypeId != self.paymentTypeId {
                return false
            }
        }

        return true
    }

    // IMAGE
    internal func getImage() -> UIImage? {
        return ResourceManager.shared.getImageFor(self)
    }

    internal func setExternalPaymentMethodImage(externalImage: UIImage?) {
        if let imageResource = externalImage {
            externalPaymentPluginImageData = imageResource.pngData() as NSData?
        }
    }

    internal func getImageForExtenalPaymentMethod() -> UIImage? {
        if let imageDataStream = externalPaymentPluginImageData as Data? {
            return UIImage(data: imageDataStream)
        }
        return nil
    }

    // COLORS
    // First Color
    internal func getColor(bin: String?) -> UIColor {
        var settings: [PXSetting]?

        if let bin = bin {
            settings = PXSetting.getSettingByBin(self.settings, bin: bin)
        }

        return ResourceManager.shared.getColorFor(self, settings: settings)
    }
    // Font Color
    internal func getFontColor(bin: String?) -> UIColor {
        var settings: [PXSetting]?

        if let bin = bin {
            settings = PXSetting.getSettingByBin(self.settings, bin: bin)
        }

        return ResourceManager.shared.getFontColorFor(self, settings: settings)
    }
    // Edit Font Color
    internal func getEditingFontColor(bin: String?) -> UIColor {
        var settings: [PXSetting]?

        if let bin = bin {
            settings = PXSetting.getSettingByBin(self.settings, bin: bin)
        }

        return ResourceManager.shared.getEditingFontColorFor(self, settings: settings)
    }

    // MASKS
    // Label Mask
    internal func getLabelMask(bin: String?) -> String {
        var settings: [PXSetting]?

        if let bin = bin {
            settings = PXSetting.getSettingByBin(self.settings, bin: bin)
        }
        return ResourceManager.shared.getLabelMaskFor(self, settings: settings)
    }
    // Edit Text Mask
    internal func getEditTextMask(bin: String?) -> String {
        var settings: [PXSetting]?

        if let bin = bin {
            settings = PXSetting.getSettingByBin(self.settings, bin: bin)
        }
        return ResourceManager.shared.getEditTextMaskFor(self, settings: settings)
    }

    var isBolbradesco: Bool {
        return self.id.contains(PXPaymentTypes.BOLBRADESCO.rawValue)
    }

    var isPec: Bool {
        return self.id.contains(PXPaymentTypes.PEC.rawValue)
    }

    internal var isPlugin: Bool {
        return paymentTypeId == PXPaymentMethodPlugin.PAYMENT_METHOD_TYPE_ID
    }

    internal func getAccreditationTimeMessage() -> String? {

        if let accreditationMinutes = self.accreditationTime {

            var accreditationMessage: String = ""

            if accreditationMinutes == 0 {
                accreditationMessage = "Se acreditará instantáneamente".localized
            } else {
                let hours = accreditationMinutes / 60
                let days = accreditationMinutes / (60 * 24)

                accreditationMessage = days < 1 ? String(format: "px_accreditation_time_hour".localized, hours).replacingOccurrences(of: "{0}", with: "\(hours)") : String(format: "px_accreditation_time_working_day".localized, days).replacingOccurrences(of: "{0}", with: "\(days)")
            }

            return accreditationMessage
        }

        return nil
    }
}

// MARK: Tracking
extension PXPaymentMethod {
    func getPaymentTypeForTracking() -> String {
        if isPlugin {
            return id
        }
        return paymentTypeId
    }
    func getPaymentIdForTracking() -> String {
        return id
    }
}
