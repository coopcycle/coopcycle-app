//
//  PXInstallment.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 10/20/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation
/// :nodoc:
open class PXInstallment: NSObject, Codable {
    open var issuer: PXIssuer?
    open var payerCosts: [PXPayerCost] = []
    open var paymentMethodId: String?
    open var paymentTypeId: String?

    public init(issuer: PXIssuer?, payerCosts: [PXPayerCost], paymentMethodId: String?, paymentTypeId: String?) {
        self.issuer = issuer
        self.payerCosts = payerCosts
        self.paymentMethodId = paymentMethodId
        self.paymentTypeId = paymentTypeId
    }

    public enum PXInstallmentKeys: String, CodingKey {
        case issuer = "issuer"
        case payerCosts = "payer_costs"
        case paymentMethodId = "payment_method_id"
        case paymentTypeId = "payment_type_id"
    }

    required public convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: PXInstallmentKeys.self)
        let issuer: PXIssuer? = try container.decodeIfPresent(PXIssuer.self, forKey: .issuer)
        let payerCosts: [PXPayerCost] = try container.decodeIfPresent([PXPayerCost].self, forKey: .payerCosts) ?? []
        let paymentMethodId: String? = try container.decodeIfPresent(String.self, forKey: .paymentMethodId)
        let paymentTypeId: String? = try container.decodeIfPresent(String.self, forKey: .paymentTypeId)

        self.init(issuer: issuer, payerCosts: payerCosts, paymentMethodId: paymentMethodId, paymentTypeId: paymentTypeId)
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: PXInstallmentKeys.self)
        try container.encodeIfPresent(self.issuer, forKey: .issuer)
        try container.encodeIfPresent(self.payerCosts, forKey: .payerCosts)
        try container.encodeIfPresent(self.paymentMethodId, forKey: .paymentMethodId)
        try container.encodeIfPresent(self.paymentTypeId, forKey: .paymentTypeId)
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

    open class func fromJSONToPXInstallment(data: Data) throws -> PXInstallment {
        return try JSONDecoder().decode(PXInstallment.self, from: data)
    }

    open class func fromJSON(data: Data) throws -> [PXInstallment] {
        return try JSONDecoder().decode([PXInstallment].self, from: data)
    }
}
