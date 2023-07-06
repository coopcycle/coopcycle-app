//
//  PXResourceProvider.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 12/5/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

internal class PXResourceProvider {

    static var error_title_default = "rejected_default_title"
    static var error_body_title_base = "¿Qué puedo hacer?"
    static var error_body_title_c4a = "error_body_title_call_for_authorize"
    static var error_body_description_base = "error_body_description_"
    static var error_body_action_text_base = "error_body_action_text_"
    static var error_body_secondary_title_base = "error_body_secondary_title_"

    static internal func getTitleForCallForAuth() -> String {
        return error_body_title_c4a.localized
    }

    static internal func getTitleForErrorBody() -> String {
        return error_body_title_base.localized
    }

    static internal func getDescriptionForErrorBodyForPENDING_CONTINGENCY() -> String {
        let key = error_body_description_base + PXPayment.StatusDetails.PENDING_CONTINGENCY
        return key.localized
    }

    static internal func getDescriptionForErrorBodyForPENDING_REVIEW_MANUAL() -> String {
        let key = error_body_description_base + PXPayment.StatusDetails.PENDING_REVIEW_MANUAL
        return key.localized
    }

    static internal func getDescriptionForErrorBodyForREJECTED_CALL_FOR_AUTHORIZE(_ amount: Double) -> String {
        let key = error_body_description_base + PXPayment.StatusDetails.REJECTED_CALL_FOR_AUTHORIZE
        let initialText = key.localized

        let currency = SiteManager.shared.getCurrency()
        let currencySymbol = currency.getCurrencySymbolOrDefault()
        let thousandSeparator = currency.getThousandsSeparatorOrDefault()
        let decimalSeparator = currency.getDecimalSeparatorOrDefault()
        let attributtedString = Utils.getAttributedAmount(amount, thousandSeparator: thousandSeparator, decimalSeparator: decimalSeparator, currencySymbol: currencySymbol, color: .white, fontSize: PXHeaderRenderer.TITLE_FONT_SIZE, centsFontSize: PXHeaderRenderer.TITLE_FONT_SIZE / 2, smallSymbol: true)
        let amountString = attributtedString.string
        let composedText = initialText.replacingOccurrences(of: "{0}", with: amountString)
        return composedText
    }

    static internal func getDescriptionForErrorBodyForREJECTED_CARD_DISABLED(_ paymentMethodName: String?) -> String {
        if let paymentMethodName = paymentMethodName {
            let key = error_body_description_base + PXPayment.StatusDetails.REJECTED_CARD_DISABLED
            return key.localized.replacingOccurrences(of: "{0}", with: paymentMethodName)
        } else {
            return error_body_description_base.localized
        }
    }

    static internal func getDescriptionForErrorBodyForREJECTED_INSUFFICIENT_AMOUNT() -> String {
        let key = error_body_description_base + PXPayment.StatusDetails.REJECTED_INSUFFICIENT_AMOUNT
        return key.localized
    }

    static internal func getDescriptionForErrorBodyForREJECTED_OTHER_REASON() -> String {
        let key = error_body_description_base + PXPayment.StatusDetails.REJECTED_OTHER_REASON
        return key.localized
    }

    static internal func getDescriptionForErrorBodyForREJECTED_BY_BANK() -> String {
        let key = error_body_description_base
        return key.localized
    }

    static internal func getDescriptionForErrorBodyForREJECTED_INSUFFICIENT_DATA() -> String {
        let key = error_body_description_base
        return key.localized
    }

    static internal func getDescriptionForErrorBodyForREJECTED_DUPLICATED_PAYMENT() -> String {
        let key = error_body_description_base + PXPayment.StatusDetails.REJECTED_DUPLICATED_PAYMENT
        return key.localized
    }

    static internal func getDescriptionForErrorBodyForREJECTED_MAX_ATTEMPTS() -> String {
        let key = error_body_description_base + PXPayment.StatusDetails.REJECTED_MAX_ATTEMPTS
        return key.localized
    }

    static internal func getDescriptionForErrorBodyForREJECTED_HIGH_RISK() -> String {
        let key = error_body_description_base + PXPayment.StatusDetails.REJECTED_HIGH_RISK
        return key.localized
    }

    static internal func getDescriptionForErrorBodyForREJECTED_CARD_HIGH_RISK() -> String {
        let key = error_body_description_base + PXPayment.StatusDetails.REJECTED_HIGH_RISK
        return key.localized
    }

    static internal func getDescriptionForErrorBodyForREJECTED_BY_REGULATIONS() -> String {
        let key = error_body_description_base + PXPayment.StatusDetails.REJECTED_BY_REGULATIONS
        return key.localized
    }

    static internal func getDescriptionForErrorBodyForREJECTED_INVALID_INSTALLMENTS() -> String {
        let key = error_body_description_base + PXPayment.StatusDetails.REJECTED_INVALID_INSTALLMENTS
        return key.localized
    }

    static internal func getActionTextForErrorBodyForREJECTED_CALL_FOR_AUTHORIZE(_ paymentMethodName: String?) -> String {

        if let paymentMethodName = paymentMethodName {
            let key = error_body_action_text_base + PXPayment.StatusDetails.REJECTED_CALL_FOR_AUTHORIZE
            return key.localized.replacingOccurrences(of: "{0}", with: paymentMethodName)
        } else {
            return error_body_action_text_base.localized
        }
    }

    static internal func getSecondaryTitleForErrorBodyForREJECTED_CALL_FOR_AUTHORIZE() -> String {
        return error_body_secondary_title_base.localized
    }

    static internal func getErrorTitleKey(statusDetail: String) -> String {
        switch statusDetail {
        case PXPayment.StatusDetails.REJECTED_BY_BANK, PXPayment.StatusDetails.REJECTED_INSUFFICIENT_DATA, PXPayment.StatusDetails.REJECTED_BY_REGULATIONS, PXPayment.StatusDetails.REJECTED_OTHER_REASON:
            return error_title_default
        default:
            return statusDetail + "_title"
        }
    }
}
