//
//  TrackingPaths+Screens.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 29/10/2018.
//

import Foundation

// MARK: Screens
extension TrackingPaths {

    internal struct Screens {
        private static let refer = "#refer="

        // Review and Confirm Path
        static func getReviewAndConfirmPath() -> String {
            return TrackingPaths.pxTrack + "/review/traditional"
        }

        // Terms and condition Path
        static func getTermsAndCondiontionPath() -> String {
            return TrackingPaths.pxTrack + payments + "/terms_and_conditions"
        }

        // Bank Deaks Path
        static func getBankDealsPath() -> String {
            return TrackingPaths.pxTrack + addPaymentMethod + "/promotions"
        }

        // Terms and Conditions deal Path
        static func getTermsAndConditionBankDealsPath() -> String {
            return TrackingPaths.pxTrack + addPaymentMethod + "/promotions/terms_and_conditions"
        }

        // Issuers Paths
        static func getIssuersPath() -> String {
            return TrackingPaths.pxTrack + payments + "/card_issuer"
        }

        // Installments Paths
        static func getInstallmentsPath() -> String {
            return TrackingPaths.pxTrack + payments + "/installments"
        }

        // Discount details path
        static func getDiscountDetailPath() -> String {
            return TrackingPaths.pxTrack + payments + "/applied_discount"
        }

        // Error path
        static func getErrorPath() -> String {
            return TrackingPaths.pxTrack + "/generic_error"
        }

        // Available payment methods paths
        static func getAvailablePaymentMethodsPath() -> String {
            return TrackingPaths.pxTrack + addPaymentMethod + "/number/error_more_info"
        }

        // Security Code Paths
        static func getSecurityCodePath(paymentTypeId: String) -> String {
            return pxTrack + payments + selectMethod + "/" + paymentTypeId + "/cvv"
        }
    }
}

// MARK: CardForm Flow Screen Paths
extension TrackingPaths.Screens {
    internal struct CardForm {
        private static let number = "/number"
        private static let name = "/name"
        private static let expirationDate = "/expiration_date"
        private static let cvv = "/cvv"
        private static let identification = "/document"

        static let cardForm = TrackingPaths.pxTrack + TrackingPaths.addPaymentMethod

        static func getCardNumberPath() -> String {
            return cardForm + number
        }

        static func getCardNamePath(paymentTypeId: String) -> String {
            return cardForm + "/" + paymentTypeId + name
        }

        static func getExpirationDatePath(paymentTypeId: String) -> String {
            return cardForm + "/" + paymentTypeId + expirationDate
        }

        static func getCvvPath(paymentTypeId: String) -> String {
            return cardForm + "/" + paymentTypeId + cvv
        }

        static func getIdentificationPath(paymentTypeId: String) -> String {
            return cardForm + "/" + paymentTypeId + identification
        }
    }
}

// MARK: Boleto Flow Screen Paths
extension TrackingPaths.Screens {
    internal struct Boleto {
        private static let cpf = "/cpf"
        private static let name = "/name"
        private static let lastName = "/lastname"

        private static let boleto = TrackingPaths.pxTrack + TrackingPaths.payments + TrackingPaths.selectMethod + "/ticket"

        static func getCpfPath() -> String {
            return boleto + cpf
        }

        static func getNamePath() -> String {
            return boleto + name
        }

        static func getLastNamePath() -> String {
            return boleto + lastName
        }
    }
}

// MARK: Payment Result Screen Paths
extension TrackingPaths.Screens {
    internal struct PaymentResult {
        private static let success = "/success"
        private static let furtherAction = "/further_action_needed"
        private static let error = "/error"
        private static let abort = "/abort"
        private static let _continue = "/continue"
        private static let primaryAction = "/primary_action"
        private static let secondaryAction = "/secondary_action"
        private static let changePaymentMethod = "/change_payment_method"

        private static let result = TrackingPaths.pxTrack + "/result"

        static func getSuccessPath() -> String {
            return result + success
        }

        static func getSuccessAbortPath() -> String {
            return getSuccessPath() + abort
        }

        static func getSuccessContinuePath() -> String {
            return getSuccessPath() + _continue
        }

        static func getSuccessPrimaryActionPath() -> String {
            return getSuccessPath() + primaryAction
        }

        static func getSuccessSecondaryActionPath() -> String {
            return getSuccessPath() + secondaryAction
        }

        static func getFurtherActionPath() -> String {
            return result + furtherAction
        }

        static func getFurtherActionAbortPath() -> String {
            return getFurtherActionPath() + abort
        }

        static func getFurtherActionContinuePath() -> String {
            return getFurtherActionPath() + _continue
        }

        static func getFurtherActionPrimaryActionPath() -> String {
            return getFurtherActionPath() + primaryAction
        }

        static func getFurtherActionSecondaryActionPath() -> String {
            return getFurtherActionPath() + secondaryAction
        }

        static func getErrorPath() -> String {
            return result + error
        }

        static func getErrorAbortPath() -> String {
            return getErrorPath() + abort
        }

        static func getErrorChangePaymentMethodPath() -> String {
            return getErrorPath() + changePaymentMethod
        }

        static func getErrorPrimaryActionPath() -> String {
            return getErrorPath() + primaryAction
        }

        static func getErrorSecondaryActionPath() -> String {
            return getErrorPath() + secondaryAction
        }
    }
}

// MARK: Payment Result Screen Paths
extension TrackingPaths.Screens {
    internal struct PaymentVault {
        private static let ticket = "/ticket"
        private static let cardType = "/cards"

        static func getPaymentVaultPath() -> String {
            return TrackingPaths.pxTrack + TrackingPaths.payments + TrackingPaths.selectMethod
        }

        static func getTicketPath() -> String {
            return getPaymentVaultPath() + ticket
        }

        static func getCardTypePath() -> String {
            return getPaymentVaultPath() + cardType
        }
    }
}
// MARK: OneTap Screen Paths
extension TrackingPaths.Screens {
    internal struct OneTap {

        static func getOneTapPath() -> String {
            return TrackingPaths.pxTrack + "/review/one_tap"
        }

        static func getOneTapInstallmentsPath() -> String {
            return TrackingPaths.pxTrack + "/review/one_tap/installments"
        }

        static func getOneTapDisabledModalPath() -> String {
            return TrackingPaths.pxTrack + "/review/one_tap/disabled_payment_method_detail"
        }

        static func getOfflineMethodsPath() -> String {
            return getOneTapPath() + "/offline_methods"
        }
    }
}
