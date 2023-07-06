//
//  PXOneTapDto.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 23/10/18.
//

import Foundation

/// :nodoc:
open class PXOneTapDto: NSObject, Codable {
    open var paymentMethodId: String?
    open var paymentTypeId: String?
    open var oneTapCard: PXOneTapCardDto?
    open var oneTapCreditsInfo: PXOneTapCreditsDto?
    open var accountMoney: PXAccountMoneyDto?
    open var newCard: PXOneTapNewCardDto?
    open var benefits: PXBenefits?
    open var status: PXStatus
    open var offlineMethods: PXOfflineMethods?

    public init(paymentMethodId: String?, paymentTypeId: String?, oneTapCard: PXOneTapCardDto?, oneTapCreditsInfo: PXOneTapCreditsDto?, accountMoney: PXAccountMoneyDto?, newCard: PXOneTapNewCardDto?, status: PXStatus, benefits: PXBenefits? = nil, offlineMethods: PXOfflineMethods?) {
        self.paymentMethodId = paymentMethodId
        self.paymentTypeId = paymentTypeId
        self.oneTapCard = oneTapCard
        self.oneTapCreditsInfo = oneTapCreditsInfo
        self.accountMoney = accountMoney
        self.newCard = newCard
        self.status = status
        self.benefits = benefits
        self.offlineMethods = offlineMethods
    }

    public enum CodingKeys: String, CodingKey {
        case paymentMethodId = "payment_method_id"
        case paymentTypeId = "payment_type_id"
        case oneTapCard = "card"
        case oneTapCreditsInfo = "consumer_credits"
        case accountMoney = "account_money"
        case newCard = "new_card"
        case status
        case benefits = "benefits"
        case offlineMethods = "offline_methods"
    }
}
