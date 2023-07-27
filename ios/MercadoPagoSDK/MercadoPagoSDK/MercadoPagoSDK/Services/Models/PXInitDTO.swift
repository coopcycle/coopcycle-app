//
//  PXInitDTO.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 18/10/19.
//  Copyright © 2019 MercadoPago. All rights reserved.
//

import Foundation
/// :nodoc:
final class PXInitDTO: NSObject, Decodable {
    public var preference: PXCheckoutPreference?
    public var oneTap: [PXOneTapDto]?
    public var currency: PXCurrency
    public var site: PXSite
    public var generalCoupon: String
    public var coupons: [String: PXDiscountConfiguration]
    public var groups: [PXPaymentMethodSearchItem] = []
    public var payerPaymentMethods: [PXCustomOptionSearchItem] = []
    public var availablePaymentMethods: [PXPaymentMethod] = []
    public var selectedDiscountConfiguration: PXDiscountConfiguration?
    public var experiments: [PXExperiment]?
    public var payerCompliance: PXPayerCompliance?

    public init(preference: PXCheckoutPreference?, oneTap: [PXOneTapDto]?, currency: PXCurrency, site: PXSite, generalCoupon: String, coupons: [String: PXDiscountConfiguration], groups: [PXPaymentMethodSearchItem], payerPaymentMethods: [PXCustomOptionSearchItem], availablePaymentMethods: [PXPaymentMethod], experiments: [PXExperiment]?, payerCompliance: PXPayerCompliance?) {
        self.preference = preference
        self.oneTap = oneTap
        self.payerCompliance = payerCompliance
        self.currency = currency
        self.site = site
        self.generalCoupon = generalCoupon
        self.coupons = coupons
        self.groups = groups
        self.payerPaymentMethods = payerPaymentMethods
        self.availablePaymentMethods = availablePaymentMethods
        self.experiments = experiments

        if let selectedDiscountConfiguration = coupons[generalCoupon] {
            self.selectedDiscountConfiguration = selectedDiscountConfiguration
        }
    }

    enum CodingKeys: String, CodingKey {
        case preference
        case oneTap = "one_tap"
        case payerCompliance = "payer_compliance"
        case currency
        case site
        case generalCoupon = "general_coupon"
        case coupons
        case groups = "groups"
        case payerPaymentMethods = "payer_payment_methods"
        case availablePaymentMethods = "available_payment_methods"
        case experiments
    }

    public class func fromJSON(data: Data) throws -> PXInitDTO {
        return try JSONDecoder().decode(PXInitDTO.self, from: data)
    }

    func getPaymentOptionsCount() -> Int {
        let payerOptionsCount = payerPaymentMethods.count
        let groupsOptionsCount = groups.count
        return payerOptionsCount + groupsOptionsCount
    }

    func hasCheckoutDefaultOption() -> Bool {
        return oneTap != nil
    }

    func deleteCheckoutDefaultOption() {
        oneTap = nil
    }

    func getPaymentMethodInExpressCheckout(targetId: String) -> (found: Bool, expressNode: PXOneTapDto?) {
        guard let expressResponse = oneTap else { return (false, nil) }
        for expressNode in expressResponse {
            guard let paymentMethodId = expressNode.paymentMethodId else {
                return (false, nil)
            }
            let cardCaseCondition = expressNode.oneTapCard != nil && expressNode.oneTapCard?.cardId == targetId
            let creditsCaseCondition = PXPaymentTypes(rawValue:paymentMethodId) == PXPaymentTypes.CONSUMER_CREDITS
            if cardCaseCondition || creditsCaseCondition {
                return (true, expressNode)
            }
        }
        return (false, nil)
    }
}
