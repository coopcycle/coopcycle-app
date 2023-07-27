//
//  PXDisabledOption.swift
//  MercadoPagoSDKV4
//
//  Created by Eden Torres on 27/08/2018.
//

import Foundation

internal struct PXDisabledOption {

    private var disabledPaymentMethodId: String?
    private var disabledCardId: String?
    private var status: PXStatus?
    private let disabledStatusDetails: [String] = [PXPayment.StatusDetails.REJECTED_CARD_HIGH_RISK,
                                                   PXPayment.StatusDetails.REJECTED_HIGH_RISK,
                                                   PXPayment.StatusDetails.REJECTED_BLACKLIST,
                                                   PXPayment.StatusDetails.REJECTED_INSUFFICIENT_AMOUNT]

    init(paymentResult: PaymentResult?) {
        if let paymentResult = paymentResult {
            status = getStatusFor(statusDetail: paymentResult.statusDetail)

            guard let paymentMethod = paymentResult.paymentData?.getPaymentMethod() else {return}
            guard disabledStatusDetails.contains(paymentResult.statusDetail) else {return}

            if !paymentMethod.isCard {
                disabledPaymentMethodId = paymentMethod.getId()
            } else if let cardId = paymentResult.paymentData?.token?.cardId {
                disabledCardId = cardId
            }
        }
    }

    func getStatusFor(statusDetail: String) -> PXStatus? {
        let mainText = PXText(message: "px_payment_method_disable_title".localized, backgroundColor: nil, textColor: nil, weight: nil)

        var secondaryString = ""

        switch statusDetail {
        case PXPayment.StatusDetails.REJECTED_CARD_HIGH_RISK:
            secondaryString = "px_dialog_detail_payment_method_disable_high_risk".localized
        case PXPayment.StatusDetails.REJECTED_HIGH_RISK:
            secondaryString = "px_dialog_detail_payment_method_disable_high_risk".localized
        case PXPayment.StatusDetails.REJECTED_BLACKLIST:
            secondaryString = "px_dialog_detail_payment_method_disable_black_list".localized
        case PXPayment.StatusDetails.REJECTED_INSUFFICIENT_AMOUNT:
            secondaryString = "error_body_description_cc_rejected_insufficient_amount".localized
        default:
            return nil
        }

        let secondaryMessage = secondaryString.replacingOccurrences(of: "\\n", with: "\n")
        let thirdMessage = "error_body_description_rejected_high_risk".localized
        let message = secondaryMessage + "\n\n" + thirdMessage
        let secondaryText = PXText(message: message, backgroundColor: nil, textColor: nil, weight: nil)
        return PXStatus(mainMessage: mainText, secondaryMessage: secondaryText, enabled: false)
    }
}

// MARK: Getters and public methods
extension PXDisabledOption {
    public func isPMDisabled(paymentMethodId: String?) -> Bool {
        guard let disabledPaymentMethodId = disabledPaymentMethodId, let paymentMethodId = paymentMethodId else {return false}
        return disabledPaymentMethodId == paymentMethodId
    }

    public func isCardIdDisabled(cardId: String?) -> Bool {
        guard let disabledCardId = disabledCardId, let cardId = cardId else {return false}
        return disabledCardId == cardId
    }

    public func getDisabledPaymentMethodId() -> String? {
        return disabledPaymentMethodId
    }

    public func getDisabledCardId() -> String? {
        return disabledCardId
    }

    public func getStatus() -> PXStatus? {
        return status
    }
}
