//
//  PXPaymentData.swift
//  MercadoPagoSDK
//
//  Created by Maria cristina rodriguez on 2/1/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import UIKit

/**
 Data needed for payment.
 */
@objcMembers public class PXPaymentData: NSObject, NSCopying {
    internal var paymentMethod: PXPaymentMethod?
    internal var issuer: PXIssuer? {
        didSet {
            processIssuer()
        }
    }
    internal var payerCost: PXPayerCost?
    internal var token: PXToken?
    internal var payer: PXPayer?
    internal var transactionAmount: NSDecimalNumber?
    internal var transactionDetails: PXTransactionDetails?
    internal private(set) var discount: PXDiscount?
    internal private(set) var campaign: PXCampaign?
    internal private(set) var consumedDiscount: Bool?
    private let paymentTypesWithoutInstallments = [PXPaymentTypes.PREPAID_CARD.rawValue]

    /// :nodoc:
    public func copy(with zone: NSZone? = nil) -> Any {
        let copyObj = PXPaymentData()
        copyObj.paymentMethod = paymentMethod
        copyObj.issuer = issuer
        copyObj.payerCost = payerCost
        copyObj.token = token
        copyObj.payerCost = payerCost
        copyObj.transactionDetails = transactionDetails
        copyObj.discount = discount
        copyObj.campaign = campaign
        copyObj.consumedDiscount = consumedDiscount
        copyObj.payer = payer
        return copyObj
    }

    internal func isComplete(shouldCheckForToken: Bool = true) -> Bool {

        guard let paymentMethod = self.paymentMethod else {
            return false
        }

        if paymentMethod.isEntityTypeRequired && payer?.entityType == nil {
            return false
        }

        if paymentMethod.isPayerInfoRequired {
            guard let identification = payer?.identification else {
                return false
            }
            if !identification.isComplete {
                return false
            }
        }

        if !Array.isNullOrEmpty(paymentMethod.financialInstitutions) && transactionDetails?.financialInstitution == nil {
            return false
        }

        if paymentMethod.id == PXPaymentTypes.ACCOUNT_MONEY.rawValue || !paymentMethod.isOnlinePaymentMethod {
            return true
        }

        if paymentMethod.isIssuerRequired && self.issuer == nil {
            return false
        }

        if paymentMethod.isCard && payerCost == nil &&
            !paymentTypesWithoutInstallments.contains(paymentMethod.paymentTypeId) {
            return false
        }

        if paymentMethod.isDigitalCurrency && payerCost == nil {
            return false
        }

        if paymentMethod.isCard && !hasToken() && shouldCheckForToken {
            return false
        }
        return true
    }

    internal func hasToken() -> Bool {
        return token != nil
    }

    internal func hasIssuer() -> Bool {
        return issuer != nil
    }

    internal func hasPayerCost() -> Bool {
        return payerCost != nil
    }

    internal func hasPaymentMethod() -> Bool {
        return paymentMethod != nil
    }

    internal func hasCustomerPaymentOption() -> Bool {
        return hasPaymentMethod() && (self.paymentMethod!.isAccountMoney || (hasToken() && !String.isNullOrEmpty(self.token!.cardId)))
    }
}

// MARK: Getters
extension PXPaymentData {
    /**
     getToken
     */
    public func getToken() -> PXToken? {
        return token
    }

    /**
     getPayerCost
     */
    public func getPayerCost() -> PXPayerCost? {
        return payerCost
    }

    /**
     getNumberOfInstallments
     */
    public func getNumberOfInstallments() -> Int {
        guard let installments = payerCost?.installments else {
            return 0
        }
        return installments
    }

    /**
     getIssuer
     */
    public func getIssuer() -> PXIssuer? {
        return issuer
    }

    /**
     getPayer
     */
    public func getPayer() -> PXPayer? {
        return payer
    }

    /**
     getPaymentMethod
     */
    public func getPaymentMethod() -> PXPaymentMethod? {
        return paymentMethod
    }

    /**
     getDiscount
     */
    public func getDiscount() -> PXDiscount? {
        return discount
    }

    /**
     getRawAmount
     */
    public func getRawAmount() -> NSDecimalNumber? {
        return transactionAmount
    }

    internal func getTransactionAmountWithDiscount() -> Double? {
        if let transactionAmount = transactionAmount {
            let transactionAmountDouble = transactionAmount.doubleValue

            if let discount = discount {
                return transactionAmountDouble - discount.couponAmount
            } else {
                return transactionAmountDouble
            }
        }
        return nil
    }
}

// MARK: Setters
extension PXPaymentData {
    internal func setDiscount(_ discount: PXDiscount?, withCampaign campaign: PXCampaign, consumedDiscount: Bool) {
        self.discount = discount
        self.campaign = campaign
        self.consumedDiscount = consumedDiscount
    }

    internal func updatePaymentDataWith(paymentMethod: PXPaymentMethod?) {
        guard let paymentMethod = paymentMethod else {
            return
        }
        cleanIssuer()
        cleanToken()
        cleanPayerCost()
        self.paymentMethod = paymentMethod
    }

    internal func updatePaymentDataWith(token: PXToken?) {
        guard let token = token else {
            return
        }
        self.token = token
    }

    internal func updatePaymentDataWith(payerCost: PXPayerCost?) {
        guard let payerCost = payerCost else {
            return
        }
        self.payerCost = payerCost
    }

    internal func updatePaymentDataWith(issuer: PXIssuer?) {
        guard let issuer = issuer else {
            return
        }
        cleanPayerCost()
        self.issuer = issuer
    }

    internal func updatePaymentDataWith(payer: PXPayer?) {
        guard let payer = payer else {
            return
        }
        self.payer = payer
    }
}

// MARK: Clears
extension PXPaymentData {
    internal func cleanToken() {
        self.token = nil
    }

    internal func cleanPayerCost() {
        self.payerCost = nil
    }

    internal func cleanIssuer() {
        self.issuer = nil
    }

    internal func cleanPaymentMethod() {
        self.paymentMethod = nil
    }

    internal func clearCollectedData() {
        clearPaymentMethodData()
        clearPayerData()
    }

    internal func clearPaymentMethodData() {
        self.paymentMethod = nil
        self.issuer = nil
        self.payerCost = nil
        self.token = nil
        self.transactionDetails = nil
        // No borrar el descuento
    }

    internal func clearPayerData() {
        self.payer = self.payer?.copy() as? PXPayer
        self.payer?.clearCollectedData()
    }

    internal func clearDiscount() {
        self.discount = nil
        self.campaign = nil
        self.consumedDiscount = nil
    }
}

// MARK: Private
extension PXPaymentData {
    private func processIssuer() {
        if let newIssuer = issuer, newIssuer.id.isEmpty {
            cleanIssuer()
        }
    }
}
