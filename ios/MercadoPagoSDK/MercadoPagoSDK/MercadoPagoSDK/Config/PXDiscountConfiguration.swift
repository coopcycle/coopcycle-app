//
//  PXDiscountConfiguration.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 10/8/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

internal typealias PXDiscountConfigurationType = (discount: PXDiscount?, campaign: PXCampaign?, isNotAvailable: Bool, reason: PXDiscountReason?)

/**
 Configuration related to Mercadopago discounts and campaigns. More details: `PXDiscount` and `PXCampaign`.
 */
@objcMembers
open class PXDiscountConfiguration: NSObject, Codable {
    private var discount: PXDiscount?
    private var campaign: PXCampaign?
    private var isNotAvailable: Bool = false
    private var reason: PXDiscountReason?

    internal override init() {
        self.discount = nil
        self.campaign = nil
        isNotAvailable = true
        self.reason = nil
    }

    /**
     Set Mercado Pago discount that will be applied to total amount.
     When you set a discount with its campaign, we do not check in discount service.
     You have to set a payment processor for discount be applied.
     - parameter discount: Mercado Pago discount.
     - parameter campaign: Discount campaign with discount data.
     */
    public init(discount: PXDiscount, campaign: PXCampaign) {
        self.discount = discount
        self.campaign = campaign
    }

    internal init(discount: PXDiscount?, campaign: PXCampaign?, isNotAvailable: Bool, reason: PXDiscountReason?) {
        self.discount = discount
        self.campaign = campaign
        self.isNotAvailable = isNotAvailable
        self.reason = reason
    }

    public enum PXDiscountConfigurationKeys: String, CodingKey {
        case discount
        case campaign
        case isAvailable =  "is_available"
        case reason
    }

    required public convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: PXDiscountConfigurationKeys.self)
        let discount: PXDiscount? = try container.decodeIfPresent(PXDiscount.self, forKey: .discount)
        let campaign: PXCampaign? = try container.decodeIfPresent(PXCampaign.self, forKey: .campaign)
        let isAvailable: Bool = try container.decode(Bool.self, forKey: .isAvailable)
        let reason: PXDiscountReason? = try container.decodeIfPresent(PXDiscountReason.self, forKey: .reason)
        self.init(discount: discount, campaign: campaign, isNotAvailable: !isAvailable, reason: reason)
    }

    /**
     When you have the user have wasted all the discounts available
     this kind of configuration will show a generic message to the user.
     */
    public static func initForNotAvailableDiscount() -> PXDiscountConfiguration {
        return PXDiscountConfiguration()
    }
}

// MARK: - Internals
extension PXDiscountConfiguration {
    internal func getDiscountConfiguration() -> PXDiscountConfigurationType {
        return (discount, campaign, isNotAvailable, reason)
    }
}
