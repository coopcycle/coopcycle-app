//
//  PaymentResult.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 2/14/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

internal class PaymentResult {

    internal enum CongratsState: Int {
        case cancel_EXIT = 0
        case cancel_SELECT_OTHER = 1
        case cancel_RETRY = 2
        case cancel_RECOVER = 3
        case call_FOR_AUTH = 4
    }

    let warningStatusDetails = [PXRejectedStatusDetail.INVALID_ESC.rawValue,
                                PXRejectedStatusDetail.CALL_FOR_AUTH.rawValue,
                                PXRejectedStatusDetail.BAD_FILLED_CARD_NUMBER.rawValue,
                                PXRejectedStatusDetail.CARD_DISABLE.rawValue,
                                PXRejectedStatusDetail.INSUFFICIENT_AMOUNT.rawValue,
                                PXRejectedStatusDetail.REJECTED_INVALID_INSTALLMENTS.rawValue,
                                PXRejectedStatusDetail.BAD_FILLED_DATE.rawValue,
                                PXRejectedStatusDetail.BAD_FILLED_SECURITY_CODE.rawValue,
                                PXRejectedStatusDetail.BAD_FILLED_OTHER.rawValue,
                                PXPendingStatusDetail.CONTINGENCY.rawValue,
                                PXPendingStatusDetail.REVIEW_MANUAL.rawValue]

    let badFilledStatusDetails = [PXRejectedStatusDetail.BAD_FILLED_CARD_NUMBER.rawValue,
                                  PXRejectedStatusDetail.BAD_FILLED_DATE.rawValue,
                                  PXRejectedStatusDetail.BAD_FILLED_SECURITY_CODE.rawValue,
                                  PXRejectedStatusDetail.BAD_FILLED_OTHER.rawValue]

    var paymentData: PXPaymentData?
    var splitAccountMoney: PXPaymentData?
    var status: String
    var statusDetail: String
    var payerEmail: String?
    var paymentId: String?
    var statementDescription: String?
    var cardId: String?
    var paymentMethodId: String?
    var paymentMethodTypeId: String?

    init (payment: PXPayment, paymentData: PXPaymentData) {
        self.status = payment.status
        self.statusDetail = payment.statusDetail
        self.paymentData = paymentData
        self.paymentId = payment.id.stringValue
        self.payerEmail = paymentData.payer?.email
        self.statementDescription = payment.statementDescriptor
        self.cardId = payment.card?.id
    }

    init (status: String, statusDetail: String, paymentData: PXPaymentData, splitAccountMoney: PXPaymentData?, payerEmail: String?, paymentId: String?, statementDescription: String?, paymentMethodId: String? = nil, paymentMethodTypeId: String? = nil) {
        self.status = status
        self.statusDetail = statusDetail
        self.paymentData = paymentData
        self.splitAccountMoney = splitAccountMoney
        self.payerEmail = payerEmail
        self.paymentId = paymentId
        self.statementDescription = statementDescription
        self.cardId = paymentData.token?.cardId
        self.paymentMethodTypeId = paymentMethodTypeId
        self.paymentMethodId = paymentMethodId
    }

    func isCallForAuth() -> Bool {
        return self.statusDetail == PXRejectedStatusDetail.CALL_FOR_AUTH.rawValue
    }

    func isInvalidInstallments() -> Bool {
        return self.statusDetail == PXRejectedStatusDetail.REJECTED_INVALID_INSTALLMENTS.rawValue
    }

    func isDuplicatedPayment() -> Bool {
        return self.statusDetail == PXRejectedStatusDetail.DUPLICATED_PAYMENT.rawValue
    }

    func isFraudPayment() -> Bool {
        return self.statusDetail == PXRejectedStatusDetail.REJECTED_FRAUD.rawValue
    }

    func isCardDisabled() -> Bool {
        return self.statusDetail == PXRejectedStatusDetail.CARD_DISABLE.rawValue
    }

    func isBadFilled() -> Bool {
        return badFilledStatusDetails.contains(statusDetail)
    }

    func hasSecondaryButton() -> Bool {
        return self.isCallForAuth() ||
            self.isBadFilled() ||
            self.isInvalidInstallments() ||
            self.isCardDisabled()
    }

    func isApproved() -> Bool {
        return self.status == PXPaymentStatus.APPROVED.rawValue
    }

    func isPending() -> Bool {
        return self.status == PXPaymentStatus.PENDING.rawValue
    }

    func isInProcess() -> Bool {
        return self.status == PXPaymentStatus.IN_PROCESS.rawValue
    }

    func isRejected() -> Bool {
        return self.status == PXPaymentStatus.REJECTED.rawValue
    }

    func isInvalidESC() -> Bool {
        return self.statusDetail == PXRejectedStatusDetail.INVALID_ESC.rawValue
    }

    func isReviewManual() -> Bool {
        return self.statusDetail == PXPendingStatusDetail.REVIEW_MANUAL.rawValue
    }

    func isWaitingForPayment() -> Bool {
        return self.statusDetail == PXPendingStatusDetail.WAITING_PAYMENT.rawValue
    }

    func isContingency() -> Bool {
        return self.statusDetail == PXPendingStatusDetail.CONTINGENCY.rawValue
    }

    func isAccountMoney() -> Bool {
        return self.paymentData?.getPaymentMethod()?.isAccountMoney ?? false
    }
}

// MARK: Congrats logic
extension PaymentResult {
    func isAccepted() -> Bool {
        return isApproved() || isInProcess() || isPending()
    }

    func isWarning() -> Bool {
        if !isRejected() {
            return false
        }
        if warningStatusDetails.contains(statusDetail) {
            return true
        }
        return false
    }

    func isError() -> Bool {
        if !isRejected() {
            return false
        }
        return !isWarning()
    }
}
