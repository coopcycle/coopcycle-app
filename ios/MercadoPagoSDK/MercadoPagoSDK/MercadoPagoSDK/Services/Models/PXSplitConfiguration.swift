//
//  PXSplitConfiguration.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 08/01/2019.
//

import Foundation
/// :nodoc:
open class PXSplitConfiguration: NSObject, Codable {

    open var primaryPaymentMethod: PXSplitPaymentMethod?
    open var secondaryPaymentMethod: PXSplitPaymentMethod?
    open var splitEnabled: Bool = false

    public init(primaryPaymentMethod: PXSplitPaymentMethod?, secondaryPaymentMethod: PXSplitPaymentMethod?, splitEnabled: Bool) {
        self.primaryPaymentMethod = primaryPaymentMethod
        self.secondaryPaymentMethod = secondaryPaymentMethod
        self.splitEnabled = splitEnabled
    }

    public enum PXPayerCostConfiguration: String, CodingKey {
        case defaultSplit = "default_enabled"
        case primaryPaymentMethod = "primary_payment_method"
        case secondaryPaymentMethod = "secondary_payment_method"
    }

    required public convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: PXPayerCostConfiguration.self)
        let defaultSplit: Bool = try container.decodeIfPresent(Bool.self, forKey: .defaultSplit) ?? false
        let primaryPaymentMethod: PXSplitPaymentMethod? = try container.decodeIfPresent(PXSplitPaymentMethod.self, forKey: .primaryPaymentMethod)
        let secondaryPaymentMethod: PXSplitPaymentMethod? = try container.decodeIfPresent(PXSplitPaymentMethod.self, forKey: .secondaryPaymentMethod)
        self.init(primaryPaymentMethod: primaryPaymentMethod, secondaryPaymentMethod: secondaryPaymentMethod, splitEnabled: defaultSplit)
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: PXPayerCostConfiguration.self)
        try container.encodeIfPresent(self.splitEnabled, forKey: .defaultSplit)
        try container.encodeIfPresent(self.primaryPaymentMethod, forKey: .primaryPaymentMethod)
        try container.encodeIfPresent(self.secondaryPaymentMethod, forKey: .secondaryPaymentMethod)
    }

    open func toJSONString() throws -> String? {
        let encoder = JSONEncoder()
        let data = try encoder.encode(self)
        return String(data: data, encoding: .utf8)
    }

    open func toJSON() throws -> Data {
        let encoder = JSONEncoder()
        return try encoder.encode(self)
    }
}
