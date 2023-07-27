//
//  PXCardSliderViewModel.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 31/10/18.
//

import UIKit
import MLCardDrawer

final class PXCardSliderViewModel {
    let paymentMethodId: String
    let paymentTypeId: String?
    let issuerId: String
    let cardUI: CardUI
    var shouldShowArrow: Bool
    var accountMoneyBalance: Double?
    var cardData: CardData?
    var selectedPayerCost: PXPayerCost?
    var payerCost: [PXPayerCost] = [PXPayerCost]()
    var cardId: String?
    var displayMessage: NSAttributedString?
    var amountConfiguration: PXAmountConfiguration?
    let creditsViewModel: PXCreditsViewModel?
    let status: PXStatus
    var isCredits: Bool {
        return self.paymentMethodId == PXPaymentTypes.CONSUMER_CREDITS.rawValue
    }
    var bottomMessage: String?
    var benefits: PXBenefits?
    var userDidSelectPayerCost: Bool = false

    init(_ paymentMethodId: String, _ paymentTypeId: String?, _ issuerId: String, _ cardUI: CardUI, _ cardData: CardData?, _ payerCost: [PXPayerCost], _ selectedPayerCost: PXPayerCost?, _ cardId: String? = nil, _ shouldShowArrow: Bool, amountConfiguration: PXAmountConfiguration?, creditsViewModel: PXCreditsViewModel? = nil, status: PXStatus, bottomMessage: String? = nil, benefits: PXBenefits?) {
        self.paymentMethodId = paymentMethodId
        self.paymentTypeId = paymentTypeId
        self.issuerId = issuerId
        self.cardUI = cardUI
        self.cardData = cardData
        self.payerCost = payerCost
        self.selectedPayerCost = selectedPayerCost
        self.cardId = cardId
        self.shouldShowArrow = !status.enabled ? false : shouldShowArrow
        self.amountConfiguration = amountConfiguration
        self.creditsViewModel = creditsViewModel
        self.status = status
        self.bottomMessage = bottomMessage
        self.benefits = benefits
    }
}

extension PXCardSliderViewModel: PaymentMethodOption {
    func getPaymentType() -> String {
        return paymentTypeId ?? ""
    }

    func getId() -> String {
        return paymentMethodId
    }

    func getDescription() -> String {
        return ""
    }

    func getComment() -> String {
        return ""
    }

    func hasChildren() -> Bool {
        return false
    }

    func getChildren() -> [PaymentMethodOption]? {
        return nil
    }

    func isCard() -> Bool {
        return PXPaymentTypes.ACCOUNT_MONEY.rawValue != paymentMethodId
    }

    func isCustomerPaymentMethod() -> Bool {
        return PXPaymentTypes.ACCOUNT_MONEY.rawValue != paymentMethodId
    }

    func shouldShowInstallmentsHeader() -> Bool {
        return !userDidSelectPayerCost && status.enabled
    }

    func getReimbursement() -> PXInstallmentsConfiguration? {
        return benefits?.reimbursement
    }

    func getInterestFree() -> PXInstallmentsConfiguration? {
        return benefits?.interestFree
    }
}

// MARK: Setters
extension PXCardSliderViewModel {
    func setAccountMoney(accountMoneyBalance: Double) {
        self.accountMoneyBalance = accountMoneyBalance
    }
}
