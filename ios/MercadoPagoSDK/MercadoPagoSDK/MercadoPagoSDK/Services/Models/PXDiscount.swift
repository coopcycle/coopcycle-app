//
//  PXDiscount.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 10/20/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

/**
 * Model object that represents the discount which will be applied to a payment.
 */
@objc
open class PXDiscount: NSObject, Codable {
    // MARK: Public Accessors.
    /**
     * ID
     */
    open var id: String!
    /**
     * NAME
     */
    open var name: String?
    /**
     * percentOff
     */
    open var percentOff: Double
    /**
     * amountOff
     */
    open var amountOff: Double
    /**
     * couponAmount
     */
    open var couponAmount: Double
    /**
     * currencyId
     */
    open var currencyId: String?

    // MARK: Init.
    /**
     Builder for discount construction.
     This discount have to be created in Mercado Pago.
     - parameter id: Discount id
     - parameter name: Discount name (Optional)
     - parameter percentOff: Number of percent off.
     - parameter amountOff: Number of amount off.
     - parameter couponAmount: Coupon amount value.
     - parameter currencyId: Currency id string symbol.
     */
    @objc
    public init(id: String, name: String?, percentOff: Double, amountOff: Double, couponAmount: Double, currencyId: String?) {
        self.id = id
        self.name = name
        self.percentOff = percentOff
        self.amountOff = amountOff
        self.couponAmount = couponAmount
        self.currencyId = currencyId
    }

    /// :nodoc:
    public enum PXDiscountKeys: String, CodingKey {
        case id
        case name
        case percentOff = "percent_off"
        case amountOff = "amount_off"
        case couponAmount = "coupon_amount"
        case currencyId = "currency_id"
    }

    /// :nodoc:
    required public convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: PXDiscountKeys.self)
        let percentOff: Double = try container.decodeIfPresent(Double.self, forKey: .percentOff) ?? 0
        let amountOff: Double = try container.decodeIfPresent(Double.self, forKey: .amountOff) ?? 0
        let couponAmount: Double = (try container.decodeIfPresent(Double.self, forKey: .couponAmount)) ?? 0
        var id = ""
        do {
            let intId: Int64? = try container.decodeIfPresent(Int64.self, forKey: .id)
            id = intId?.stringValue ?? ""
        } catch {
            let stringId = try container.decodeIfPresent(String.self, forKey: .id)
            id = stringId ?? ""
        }
        let name: String? = try container.decodeIfPresent(String.self, forKey: .name)
        let currencyId: String? = try container.decodeIfPresent(String.self, forKey: .currencyId)

        self.init(id: id, name: name, percentOff: percentOff, amountOff: amountOff, couponAmount: couponAmount, currencyId: currencyId)
    }

    /// :nodoc:
    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: PXDiscountKeys.self)
        try container.encodeIfPresent(self.percentOff, forKey: .percentOff)
        try container.encodeIfPresent(self.amountOff, forKey: .amountOff)
        try container.encodeIfPresent(self.couponAmount, forKey: .couponAmount)
        try container.encodeIfPresent(self.id, forKey: .id)
        try container.encodeIfPresent(self.name, forKey: .name)
        try container.encodeIfPresent(self.currencyId, forKey: .currencyId)
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
    open class func fromJSON(data: Data) throws -> PXDiscount {
        return try JSONDecoder().decode(PXDiscount.self, from: data)
    }
}

// MARK: Getters
extension PXDiscount {
    /// :nodoc:
    @objc
    public func getId() -> String? {
        return id
    }

    /// :nodoc:
    @objc
    public func getCouponAmount() -> NSDecimalNumber? {
        return PXAmountHelper.getRoundedAmountAsNsDecimalNumber(amount: couponAmount)
    }
}
