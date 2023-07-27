//
//  PaymentStatus.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 2/22/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

/**
 Use this enum only for reference.
 */
public enum PXPaymentStatus: String {
    /**
     APPROVED - Payment status.
     */
    case APPROVED = "approved"
    /**
     REJECTED - Payment status.
     */
    case REJECTED = "rejected"
    /**
     RECOVERY - Payment status.
     */
    case RECOVERY = "recovery"
    /**
     IN_PROCESS - Payment status.
     */
    case IN_PROCESS = "in_process"
    /**
     PENDING - Payment status.
     */
    case PENDING = "pending"
}

/**
 Use this enum only for reference.
 */
public enum PXRejectedStatusDetail: String {
    /**
     HIGH_RISK - Rejected status detail.
     */
    case HIGH_RISK = "rejected_high_risk"
    /**
     OTHER_REASON - Rejected status detail.
     */
    case OTHER_REASON = "cc_rejected_other_reason"
    /**
     MAX_ATTEMPTS - Rejected status detail.
     */
    case MAX_ATTEMPTS = "cc_rejected_max_attempts"
    /**
     CARD_DISABLE - Rejected status detail.
     */
    case CARD_DISABLE = "cc_rejected_card_disabled"
    /**
     BAD_FILLED_OTHER - Rejected status detail.
     */
    case BAD_FILLED_OTHER = "cc_rejected_bad_filled_other"
    /**
     BAD_FILLED_CARD_NUMBER - Rejected status detail.
     */
    case BAD_FILLED_CARD_NUMBER = "cc_rejected_bad_filled_card_number"
    /**
     BAD_FILLED_SECURITY_CODE - Rejected status detail.
     */
    case BAD_FILLED_SECURITY_CODE = "cc_rejected_bad_filled_security_code"
    /**
     BAD_FILLED_DATE - Rejected status detail.
     */
    case BAD_FILLED_DATE = "cc_rejected_bad_filled_date"
    /**
     CALL_FOR_AUTH - Rejected status detail.
     */
    case CALL_FOR_AUTH = "cc_rejected_call_for_authorize"
    /**
     DUPLICATED_PAYMENT - Rejected status detail.
     */
    case DUPLICATED_PAYMENT = "cc_rejected_duplicated_payment"
    /**
     INSUFFICIENT_AMOUNT - Rejected status detail.
     */
    case INSUFFICIENT_AMOUNT = "cc_rejected_insufficient_amount"
    /**
     INSUFFICIENT_DATA - Rejected status detail.
     */
    case INSUFFICIENT_DATA = "rejected_insufficient_data"
    /**
     REJECTED_BY_BANK - Rejected status detail.
     */
    case REJECTED_BY_BANK = "rejected_by_bank"
    /**
     INVALID_ESC - Rejected status detail.
     */
    case INVALID_ESC = "invalid_esc"
    /**
     REJECTED_PLUGIN_PM - Rejected status detail.
     */
    case REJECTED_PLUGIN_PM = "cc_rejected_plugin_pm"
    /**
     REJECTED_INVALID_INSTALLMENTS - The user has chosen an invalid option for installments.
     */
    case REJECTED_INVALID_INSTALLMENTS = "cc_rejected_invalid_installments"
    /**
     REJECTED_FRAUD - User account has been suspended.
     */
    case REJECTED_FRAUD = "cc_rejected_fraud"
    /**
     REJECTED_BLACKLIST - The card has been blacklisted.
     */
    case REJECTED_BLACKLIST = "cc_rejected_blacklist"
    /**
     REJECTED_BY_REGULATIONS - The MLB user needs to complete some information to proceed.
     */
    case REJECTED_BY_REGULATIONS = "rejected_by_regulations"
}

/**
 Use this enum only for reference.
 */
public enum PXPendingStatusDetail: String {
    /**
     CONTINGENCY - PXPendingStatusDetail.
     */
    case CONTINGENCY = "pending_contingency"
    /**
     REVIEW_MANUAL - PXPendingStatusDetail.
     */
    case REVIEW_MANUAL = "pending_review_manual"
    /**
     WAITING_PAYMENT - PXPendingStatusDetail.
     */
    case WAITING_PAYMENT = "pending_waiting_payment"
}
