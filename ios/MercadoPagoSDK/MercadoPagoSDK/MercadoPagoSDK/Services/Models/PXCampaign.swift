//
//  PXCampaign.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 10/23/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

/**
 * Model that represents a discount campaign.
 */
@objc
open class PXCampaign: NSObject, Codable {
    /// :nodoc:
    open var id: Int64?
    /// :nodoc:
    open var code: String?
    /// :nodoc:
    open var name: String?
    /// :nodoc:
    open var discountType: String?
    /// :nodoc:
    open var value: Double?
    /// :nodoc:
    open var endDate: Date?
    /// :nodoc:
    open var minPaymentAmount: Double?
    /// :nodoc:
    open var maxPaymentAmount: Double?
    /// :nodoc:
    open var maxCouponAmount: Double
    /// :nodoc:
    open var totalAmountLimit: Double?
    /// :nodoc:
    open var maxCoupons: Int64?
    /// :nodoc:
    open var maxCouponsByCode: Int?
    /// :nodoc:
    open var maxRedeemPerUser: Int?
    /// :nodoc:
    open var siteId: String?
    /// :nodoc:
    open var marketplace: String?
    /// :nodoc:
    open var codeType: String?
    /// :nodoc:
    open var maxUserAmountPerCampaign: Double?
    /// :nodoc:
    open var labels: [String]?
    /// :nodoc:
    open var paymentMethodsIds: [String]?
    /// :nodoc:
    open var paymentTypesIds: [String]?
    /// :nodoc:
    open var cardIssuersIds: [String]?
    /// :nodoc:
    open var shippingModes: [String]?
    /// :nodoc:
    open var clientId: Int64?
    /// :nodoc:
    open var tags: [String]?
    /// :nodoc:
    open var multipleCodeLimit: Int?
    /// :nodoc:
    open var codeCount: Int?
    /// :nodoc:
    open var couponAmount: Double?
    /// :nodoc:
    open var collectors: [Int64]?
    /// :nodoc:
    open var legalTermsUrl: String?

    // MARK: Init.
    /**
     Mandatory init.
     - parameter id: Campaign id.
     - parameter code: Campaign code.
     - parameter maxRedeemPerUser: Campaign max redeem per user.
     - parameter name: Campaign name.
     - parameter maxCouponAmount: Campaign max coupon amount.
     - parameter endDate: Campaign end date.
     */
   @objc
    public init(id: Int64, code: String?, maxRedeemPerUser: Int = 1, name: String?, maxCouponAmount: Double, endDate: Date) {
        self.id = id
        self.code = code
        self.name = name
        self.maxRedeemPerUser = maxRedeemPerUser
        self.maxCouponAmount = maxCouponAmount
        self.endDate = endDate
    }

    /// :nodoc:
    @objc
    public init(id: Int64, code: String?, name: String?, maxCouponAmount: Double) {
        self.id = id
        self.code = code
        self.name = name
        self.maxCouponAmount = maxCouponAmount
    }

    /// :nodoc:
    public init(id: Int64?, code: String?, name: String?, discountType: String?, value: Double?, endDate: Date?, minPaymentAmount: Double?, maxPaymentAmount: Double?, maxCouponAmount: Double?, totalAmountLimit: Double?, maxCoupons: Int64?, maxCouponsByCode: Int?, maxRedeemPerUser: Int?, siteId: String?, marketplace: String?, codeType: String?, maxUserAmountPerCampaign: Double?, labels: [String]?, paymentMethodsIds: [String]?, paymentTypesIds: [String]?, cardIssuersIds: [String]?, shippingModes: [String]?, clientId: Int64?, tags: [String]?, multipleCodeLimit: Int?, codeCount: Int?, couponAmount: Double?, collectors: [Int64]?, legalTermsUrl: String?) {
        self.id = id
        self.code = code
        self.name = name
        self.discountType = discountType
        self.value = value
        self.endDate = endDate
        self.minPaymentAmount = minPaymentAmount
        self.maxPaymentAmount = maxPaymentAmount
        self.maxCouponAmount = maxCouponAmount!
        self.totalAmountLimit = totalAmountLimit
        self.maxCoupons = maxCoupons
        self.maxCouponsByCode = maxCouponsByCode
        self.maxRedeemPerUser = maxRedeemPerUser
        self.siteId = siteId
        self.marketplace = marketplace
        self.codeType = codeType
        self.maxUserAmountPerCampaign = maxUserAmountPerCampaign
        self.labels = labels
        self.paymentMethodsIds = paymentMethodsIds
        self.paymentTypesIds = paymentTypesIds
        self.cardIssuersIds = cardIssuersIds
        self.shippingModes = shippingModes
        self.clientId = clientId
        self.tags = tags
        self.multipleCodeLimit = multipleCodeLimit
        self.codeCount = codeCount
        self.couponAmount = couponAmount
        self.collectors = collectors
        self.legalTermsUrl = legalTermsUrl
    }

    /// :nodoc:
    public enum PXCampaignKeys: String, CodingKey {
        case id
        case code
        case name
        case discountType = "discount_type"
        case value
        case endDate = "end_date"
        case minPaymentAmount = "min_payment_amount"
        case maxPaymentAmount = "max_payment_amount"
        case maxCouponAmount = "max_coupon_amount"
        case totalAmountLimit = "total_amount_limit"
        case maxCoupons = "max_coupons"
        case maxCouponsByCode = "max_coupons_by_code"
        case maxRedeemPerUser = "max_redeem_per_user"
        case siteId = "site_id"
        case marketplace
        case codeType = "code_type"
        case maxUserAmountPerCampaign = "max_user_amount_per_campaign"
        case labels
        case paymentMethodsIds = "payment_methods_ids"
        case paymentTypesIds = "payment_types_ids"
        case cardIssuersIds = "card_issuers_ids"
        case shippingModes = "shipping_modes"
        case clientId = "client_id"
        case tags
        case multipleCodeLimit = "multiple_code_limit"
        case codeCount = "code_count"
        case couponAmount = "coupon_amount"
        case collectors
        case legalTermsUrl = "legal_terms"
    }

    /// :nodoc:
    required public convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: PXCampaignKeys.self)
        let id: Int64? = try container.decodeIfPresent(Int64.self, forKey: .id)
        let code: String? = try container.decodeIfPresent(String.self, forKey: .code)
        let name: String? = try container.decodeIfPresent(String.self, forKey: .name)
        let discountType: String? = try container.decodeIfPresent(String.self, forKey: .discountType)
        let value: Double? = try container.decodeIfPresent(Double.self, forKey: .value)
        let endDate: Date?  = try container.decodeDateFromStringIfPresent(forKey: .endDate)
        let minPaymentAmount: Double? = try container.decodeIfPresent(Double.self, forKey: .minPaymentAmount)
        let maxPaymentAmount: Double? = try container.decodeIfPresent(Double.self, forKey: .maxPaymentAmount)
        let maxCouponAmount: Double? = try container.decodeIfPresent(Double.self, forKey: .maxCouponAmount)
        let totalAmountLimit: Double? = try container.decodeIfPresent(Double.self, forKey: .totalAmountLimit)
        let maxCoupons: Int64? = try container.decodeIfPresent(Int64.self, forKey: .maxCoupons)
        let maxCouponsByCode: Int? = try container.decodeIfPresent(Int.self, forKey: .maxCouponsByCode)
        let maxRedeemPerUser: Int? = try container.decodeIfPresent(Int.self, forKey: .maxRedeemPerUser)
        let siteId: String? = try container.decodeIfPresent(String.self, forKey: .siteId)
        let marketplace: String? = try container.decodeIfPresent(String.self, forKey: .marketplace)
        let codeType: String? = try container.decodeIfPresent(String.self, forKey: .codeType)
        let maxUserAmountPerCampaign: Double? = try container.decodeIfPresent(Double.self, forKey: .maxUserAmountPerCampaign)
        let labels: [String]? = try container.decodeIfPresent([String].self, forKey: .labels)
        let paymentMethodsIds: [String]? = try container.decodeIfPresent([String].self, forKey: .paymentMethodsIds)
        let paymentTypesIds: [String]? = try container.decodeIfPresent([String].self, forKey: .paymentTypesIds)
        let cardIssuersIds: [String]? = try container.decodeIfPresent([String].self, forKey: .cardIssuersIds)
        let shippingModes: [String]? = try container.decodeIfPresent([String].self, forKey: .shippingModes)
        let clientId: Int64? = try container.decodeIfPresent(Int64.self, forKey: .clientId)
        let tags: [String]? = try container.decodeIfPresent([String].self, forKey: .tags)
        let multipleCodeLimit: Int? = try container.decodeIfPresent(Int.self, forKey: .multipleCodeLimit)
        let codeCount: Int? = try container.decodeIfPresent(Int.self, forKey: .codeCount)
        let couponAmount: Double? = try container.decodeIfPresent(Double.self, forKey: .couponAmount)
        let collectors: [Int64]? = try container.decodeIfPresent([Int64].self, forKey: .collectors)
        let legalTermsUrl: String? = try container.decodeIfPresent(String.self, forKey: .legalTermsUrl)

        self.init(id: id, code: code, name: name, discountType: discountType, value: value, endDate: endDate, minPaymentAmount: minPaymentAmount, maxPaymentAmount: maxPaymentAmount, maxCouponAmount: maxCouponAmount, totalAmountLimit: totalAmountLimit, maxCoupons: maxCoupons, maxCouponsByCode: maxCouponsByCode, maxRedeemPerUser: maxRedeemPerUser, siteId: siteId, marketplace: marketplace, codeType: codeType, maxUserAmountPerCampaign: maxUserAmountPerCampaign, labels: labels, paymentMethodsIds: paymentMethodsIds, paymentTypesIds: paymentTypesIds, cardIssuersIds: cardIssuersIds, shippingModes: shippingModes, clientId: clientId, tags: tags, multipleCodeLimit: multipleCodeLimit, codeCount: codeCount, couponAmount: couponAmount, collectors: collectors, legalTermsUrl: legalTermsUrl)
    }

    /// :nodoc:
    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: PXCampaignKeys.self)
        try container.encodeIfPresent(self.id, forKey: .id)
        try container.encodeIfPresent(self, forKey: .code)
        try container.encodeIfPresent(self, forKey: .name)
        try container.encodeIfPresent(self, forKey: .discountType)
        try container.encodeIfPresent(self, forKey: .value)
        try container.encodeIfPresent(self, forKey: .endDate)
        try container.encodeIfPresent(self, forKey: .minPaymentAmount)
        try container.encodeIfPresent(self, forKey: .maxPaymentAmount)
        try container.encodeIfPresent(self, forKey: .maxCouponAmount)
        try container.encodeIfPresent(self, forKey: .totalAmountLimit)
        try container.encodeIfPresent(self, forKey: .maxCoupons)
        try container.encodeIfPresent(self, forKey: .maxCouponsByCode)
        try container.encodeIfPresent(self, forKey: .maxRedeemPerUser)
        try container.encodeIfPresent(self, forKey: .siteId)
        try container.encodeIfPresent(self, forKey: .marketplace)
        try container.encodeIfPresent(self, forKey: .codeType)
        try container.encodeIfPresent(self, forKey: .maxUserAmountPerCampaign)
        try container.encodeIfPresent(self, forKey: .labels)
        try container.encodeIfPresent(self, forKey: .paymentMethodsIds)
        try container.encodeIfPresent(self, forKey: .paymentTypesIds)
        try container.encodeIfPresent(self, forKey: .cardIssuersIds)
        try container.encodeIfPresent(self, forKey: .shippingModes)
        try container.encodeIfPresent(self, forKey: .clientId)
        try container.encodeIfPresent(self, forKey: .tags)
        try container.encodeIfPresent(self, forKey: .multipleCodeLimit)
        try container.encodeIfPresent(self, forKey: .codeCount)
        try container.encodeIfPresent(self, forKey: .couponAmount)
        try container.encodeIfPresent(self, forKey: .collectors)
        try container.encodeIfPresent(self, forKey: .legalTermsUrl)
    }

    /// :nodoc:
    open func toJSONString() throws -> String? {
        let encoder = JSONEncoder()
        let data = try encoder.encode(self)
        return String(data: data, encoding: .utf8)
    }

    /// :nodoc:
    open func toJSON() throws -> Data {
        let encoder = JSONEncoder()
        return try encoder.encode(self)
    }

    /// :nodoc:
    open class func fromJSONToPXCampaing(data: Data) throws -> PXCampaign {
        return try JSONDecoder().decode(PXCampaign.self, from: data)
    }

    /// :nodoc:
    open class func fromJSON(data: Data) throws -> [PXCampaign] {
        return try JSONDecoder().decode([PXCampaign].self, from: data)
    }
}

// MARK: Getters
extension PXCampaign {
    /// :nodoc:
    @objc
    public func getId() -> Int64 {
        return id ?? 0
    }
}
