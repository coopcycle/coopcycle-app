//
//  PXCheckoutPreference+Business.swift
//  MercadoPagoSDKV4
//
//  Created by Eden Torres on 04/09/2018.
//

import Foundation
extension PXCheckoutPreference {
    internal func isExpired() -> Bool {
        let date = Date()
        if let expirationDateTo = expirationDateTo {
            return expirationDateTo < date
        }
        return false
    }

    internal func isActive() -> Bool {
        let date = Date()
        if let expirationDateFrom = expirationDateFrom {
            return expirationDateFrom < date
        }
        return true
    }

    internal func hasMultipleItems() -> Bool {
        return items.count > 1
    }

    internal func clearCardId() {
        self.paymentPreference.cardId = nil
    }
}

// MARK: Setters
extension PXCheckoutPreference {
    /**
     Date that indicates when this preference expires.
     If the preference is expired, then the checkout will show an error.
     - parameter expirationDate: Date expiration.
     */
    open func setExpirationDate(_ expirationDate: Date) {
        self.expirationDateTo = expirationDate
    }

    /**
     Date that indicates when this preference start.
     - parameter date: Date active.
     */
    open func setActiveFromDate(_ date: Date) {
        self.expirationDateFrom = date
    }

    /**
     Differential pricing configuration for this preference.
     This object is related with the way the installments are asked.
     - parameter differentialPricing: `PXDifferentialPricing` pricing object.
     */
    open func setDifferentialPricing(differentialPricing: PXDifferentialPricing) {
        self.differentialPricing = differentialPricing
    }

    /**
     Add exclusion payment method id. If you exclude it, it's not going appear as a payment method available on checkout.
     - parameter paymentMethodId: paymentMethodId exclusion id.
     */
    public func addExcludedPaymentMethod(_ paymentMethodId: String) {
        paymentPreference.excludedPaymentMethodIds.append(paymentMethodId)
    }

    /**
     Add exclusion list by payment method id. If you exclude it, it's not going appear as a payment method available on checkout.
     - parameter paymentMethodIds: paymentMethodId exclusion id.
     */
    public func setExcludedPaymentMethods(_ paymentMethodIds: [String]) {
        self.paymentPreference.excludedPaymentMethodIds = paymentMethodIds
    }

    /**
     Add exclusion by payment type
     If you exclude it, it's not going appear as a payment method available on checkout
     - parameter paymentTypeId: paymentTypeId exclusion type
     */
    public func addExcludedPaymentType(_ paymentTypeId: String) {
        paymentPreference.excludedPaymentTypeIds.append(paymentTypeId)
    }

    /**
     Add exclusion list by payment type
     If you exclude it, it's not going appear as a payment method available on checkout
     - parameter paymentTypeIds: paymentTypeIds exclusion list.
     */
    public func setExcludedPaymentTypes(_ paymentTypeIds: [String]) {
        self.paymentPreference.excludedPaymentTypeIds = paymentTypeIds
    }

    /**
     This value limits the amount of installments to be shown by the user.
     - parameter maxInstallments: max installments to be shown
     */
    public func setMaxInstallments(_ maxInstallments: Int) {
        self.paymentPreference.maxAcceptedInstallments = maxInstallments
    }

    /**
     When default installments is not null
     then this value will be forced as installment selected if it matches
     with one provided by the Installments service.
     - parameter defaultInstallments: number of the value to be forced
     */
    public func setDefaultInstallments(_ defaultInstallments: Int) {
        self.paymentPreference.defaultInstallments = defaultInstallments
    }

    /**
     Default paymetMethodId selection.
     WARNING: This is an internal method not intended for public use.
     It is not considered part of the public API.
     - parameter paymetMethodId: Payment method ID to make default.
     */
    public func setDefaultPaymentMethodId(_ paymetMethodId: String) {
        self.paymentPreference.defaultPaymentMethodId = paymetMethodId
    }

    // MARK: MoneyIn
    /**
     Default cardId selection.
     WARNING: This is an internal method not intended for public use.
     It is not considered part of the public API. Only to support Moneyin feature.
     - parameter paymetMethodId: cardId to autoselection Moneyin feature.
     */
    public func setCardId(cardId: String) {
        self.paymentPreference.cardId = cardId
    }
}

// MARK: BinaryMode
extension PXCheckoutPreference {
    /**
     Determinate if binaryMode feature is enabled/disabled.
     */
    open func isBinaryMode() -> Bool {
        return binaryModeEnabled
    }

    /**
     Default value is `FALSE`.
     `TRUE` value processed payment can only be APPROVED or REJECTED.
     Non compatible with PaymentProcessor or off payments methods.
     - parameter isBinaryMode: Binary mode Bool value.
     */
    @discardableResult
    open func setBinaryMode(isBinaryMode: Bool) -> PXCheckoutPreference {
        self.binaryModeEnabled = isBinaryMode
        return self
    }
}

// MARK: Getters
extension PXCheckoutPreference {
    /**
     getId
     */
    open func getId() -> String {
        return self.id
    }

    /**
     getItems
     */
    open func getItems() -> [PXItem]? {
        return items
    }

    /**
     getSiteId
     */
    open func getSiteId() -> String {
        return self.siteId
    }

    /**
     getExpirationDate
     */
    open func getExpirationDate() -> Date? {
        return expirationDateTo
    }

    /**
     getActiveFromDate
     */
    open func getActiveFromDate() -> Date? {
        return expirationDateFrom
    }

    /**
     getExcludedPaymentTypesIds
     */
    open func getExcludedPaymentTypesIds() -> [String] {
        return paymentPreference.getExcludedPaymentTypesIds()
    }

    /**
     getDefaultInstallments
     */
    open func getDefaultInstallments() -> Int? {
        return paymentPreference.getDefaultInstallments()
    }

    /**
     getMaxAcceptedInstallments
     */
    open func getMaxAcceptedInstallments() -> Int {
        return paymentPreference.getMaxAcceptedInstallments()
    }

    /**
     getExcludedPaymentMethodsIds
     */
    open func getExcludedPaymentMethodsIds() -> [String] {
        return paymentPreference.getExcludedPaymentMethodsIds()
    }

    /**
     getDefaultPaymentMethodId
     */
    open func getDefaultPaymentMethodId() -> String? {
        return paymentPreference.getDefaultPaymentMethodId()
    }

    /**
     getTotalAmount
     */
    open func getTotalAmount() -> Double {
        var amount = 0.0
        for item in self.items {
            amount += (Double(item.quantity) * item.unitPrice)
        }
        return amount
    }
}

// MARK: Payer Setter and Getter
extension PXCheckoutPreference {
    public func setPayer(payer: PXPayer) {
        self.payer = payer
    }

    internal func getPayer() -> PXPayer {
        return payer
    }
}

// MARK: Validation
extension PXCheckoutPreference {
    internal func validate(privateKey: String?) -> String? {
        if let itemError = itemsValid() {
            return itemError
        }
        if self.payer == nil {
            return "No hay información de payer".localized
        }

        if String.isNullOrEmpty(payer.email) && String.isNullOrEmpty(privateKey) {
            return "Se requiere email de comprador".localized
        }

        if !isActive() {
            return "La preferencia no esta activa.".localized
        }

        if isExpired() {
            return "La preferencia esta expirada".localized
        }
        if self.getTotalAmount() < 0 {
            return "El monto de la compra no es válido".localized
        }
        return nil
    }

    internal func itemsValid() -> String? {
        if Array.isNullOrEmpty(items) {
            return "No hay items".localized
        }

        for item in items {
            if let error = item.validate() {
                return error
            }
        }

        return nil
    }
}
// MARK: Tracking
extension PXCheckoutPreference {
    func getCheckoutPrefForTracking() -> [String: Any] {
        //TODO: improve using a new struct codable compliant to avoid the manual creation of this dictionary
        var checkoutPrefDic: [String: Any] = [:]

        var itemsDic: [Any] = []
        for item in items {
            itemsDic.append(item.getItemForTracking())
        }
        checkoutPrefDic["items"] = itemsDic
        checkoutPrefDic["binary_mode"] = binaryModeEnabled
        checkoutPrefDic["marketplace"] = marketplace
        checkoutPrefDic["site_id"] = siteId
        checkoutPrefDic["expiration_date_from"] = expirationDateFrom?.stringDate()
        checkoutPrefDic["expiration_date_to"] = expirationDateTo?.stringDate()
        checkoutPrefDic["payment_methods"] = paymentPreference.getPaymentPreferenceForTracking()

        return checkoutPrefDic
    }
}
