//
//  PXPaymentTypeChargeRule.swift
//  MercadoPagoSDK
//
//  Created by Demian Tejo on 13/6/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import UIKit

/**
Use this object to apply a charge related to a payment type. The relationship is by `paymentTypeId`. You can specify a default `amountCharge` for each payment method.
 */ 
@objc
public final class PXPaymentTypeChargeRule: NSObject, Codable {
    // To deprecate post v4. SP integration.
    public var paymentMethodId: String {
        get {
            return paymentTypeId
        }
        set {
            paymentTypeId = paymentMethodId
        }
    }
    internal var paymentTypeId: String
    let amountCharge: Double
    internal let detailModal: UIViewController?
    let message: String?

    // MARK: Init.
    /**
     - parameter paymentMethdodId: paymentTypeId for which the currrent charge applies.
     - parameter amountCharge: Amount charge for the assigned payment type.
     */
    // To deprecate post v4. SP integration.
    @available(*, deprecated, message: "Property paymentMethdodId has been renamed to paymentTypeId")
    @objc public convenience init(paymentMethdodId: String, amountCharge: Double) {
        self.init(paymentTypeId: paymentMethdodId, amountCharge: amountCharge)
    }

    /**
     - parameter paymentTypeId: paymentTypeId for which the currrent charge applies.
     - parameter amountCharge: Amount charge for the assigned payment type.
     - parameter detailModal: Optional screen intended to be shown modally in order to give further details on why this charge applies to the current payment. This screen will pop up when the charges row is pressed.
     */
    @objc public init(paymentTypeId: String, amountCharge: Double, detailModal: UIViewController? = nil) {
        self.paymentTypeId = paymentTypeId
        self.amountCharge = amountCharge
        self.detailModal = detailModal
        self.message = nil
        super.init()
    }

    //Amount zero init with message
    /**
     - parameter paymentTypeId: paymentTypeId for which the currrent charge applies.
     - parameter message: Message that is shown whenever the amount is set to zero.
     */
    @objc public init(paymentTypeId: String, message: String) {
        self.paymentTypeId = paymentTypeId
        self.amountCharge = 0.0
        self.detailModal = nil
        self.message = message
        super.init()
    }

    required public init(from decoder: Decoder) throws {
        let values = try decoder.container(keyedBy: PXPaymentTypeChargeRuleKeys.self)
        paymentTypeId = try values.decode(String.self, forKey: .paymentTypeId)
        amountCharge = try values.decode(Double.self, forKey: .amountCharge)
        detailModal = nil
        message = try values.decodeIfPresent(String.self, forKey: .message)
    }

    public enum PXPaymentTypeChargeRuleKeys: String, CodingKey {
        case paymentTypeId = "payment_type_id"
        case amountCharge = "charge"
        case message
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: PXPaymentTypeChargeRuleKeys.self)
        try container.encodeIfPresent(self.paymentTypeId, forKey: .paymentTypeId)
        try container.encodeIfPresent(self.amountCharge, forKey: .amountCharge)
        try container.encodeIfPresent(self.message, forKey: .message)
    }

    public func toJSONString() throws -> String? {
        let encoder = JSONEncoder()
        let data = try encoder.encode(self)
        return String(data: data, encoding: .utf8)
    }

    public func toJSON() throws -> Data {
        let encoder = JSONEncoder()
        return try encoder.encode(self)
    }

    public class func fromJSON(data: Data) throws -> PXPaymentTypeChargeRule {
        return try JSONDecoder().decode(PXPaymentTypeChargeRule.self, from: data)
    }
}
