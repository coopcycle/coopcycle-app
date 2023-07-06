//
//  PXPaymentTypes.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 24/08/2018.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

/**
Use this enum only for reference.
 */
public enum PXPaymentTypes: String {
    /**
     DEBIT_CARD - Payment type
     */
    case DEBIT_CARD = "debit_card"
    /**
     CREDIT_CARD - Payment type
     */
    case CREDIT_CARD = "credit_card"
    /**
     ACCOUNT_MONEY - Payment type
     */
    case ACCOUNT_MONEY = "account_money"
    /**
     TICKET - Payment type
     */
    case TICKET = "ticket"
    /**
     BANK_TRANSFER - Payment type
     */
    case BANK_TRANSFER = "bank_transfer"
    /**
     ATM - Payment type
     */
    case ATM = "atm"
    /**
     DIGITAL_CURRENCY - Payment type
     */
    case DIGITAL_CURRENCY = "digital_currency"

    /**
     CONSUMER_CREDITS - Payment type
     */
    case CONSUMER_CREDITS = "consumer_credits"

    /**
     PREPAID_CARD - Payment type
     */
    case PREPAID_CARD = "prepaid_card"
    /**
     BOLBRADESCO - Payment type
     */
    case BOLBRADESCO = "bolbradesco"
    /**
     PEC - Payment type
     */
    case PEC = "pec"
    /**
     PAYMENT_METHOD_PLUGIN - Payment type
     */
    case PAYMENT_METHOD_PLUGIN = "payment_method_plugin"

    internal func isCard() -> Bool {
        return self == PXPaymentTypes.DEBIT_CARD || self == PXPaymentTypes.CREDIT_CARD || self == PXPaymentTypes.PREPAID_CARD
    }

    internal func isDigitalCurrency() -> Bool {
        return self == PXPaymentTypes.DIGITAL_CURRENCY
    }

    internal func isCreditCard() -> Bool {
        return self == PXPaymentTypes.CREDIT_CARD
    }

    internal func isPrepaidCard() -> Bool {
        return self == PXPaymentTypes.PREPAID_CARD
    }

    internal func isDebitCard() -> Bool {
        return self == PXPaymentTypes.DEBIT_CARD
    }

    internal func isOnlinePaymentType() -> Bool {
        return PXPaymentTypes.onlinePaymentTypes().contains(self.rawValue)
    }

    internal func isOfflinePaymentType() -> Bool {
        return PXPaymentTypes.offlinePaymentTypes().contains(self.rawValue)

    }

    internal static func onlinePaymentTypes() -> [String] {
        return [DEBIT_CARD.rawValue, CREDIT_CARD.rawValue, ACCOUNT_MONEY.rawValue, PREPAID_CARD.rawValue, PAYMENT_METHOD_PLUGIN.rawValue]
    }

    internal static func offlinePaymentTypes() -> [String] {
        return [ATM.rawValue, TICKET.rawValue, BANK_TRANSFER.rawValue]
    }

    internal static func isCard(paymentTypeId: String) -> Bool {
        guard let paymentTypeIdEnum = PXPaymentTypes(rawValue: paymentTypeId)
            else {
                return false
        }
        return paymentTypeIdEnum.isCard()
    }

    internal static func isOnlineType(paymentTypeId: String) -> Bool {

        guard let paymentTypeIdEnum = PXPaymentTypes(rawValue: paymentTypeId)
            else {
                return false
        }
        return paymentTypeIdEnum.isOnlinePaymentType()
    }

    internal static func isOfflineType(paymentTypeId: String) -> Bool {

        guard let paymentTypeIdEnum = PXPaymentTypes(rawValue: paymentTypeId)
            else {
                return false
        }
        return paymentTypeIdEnum.isOfflinePaymentType()
    }
}
