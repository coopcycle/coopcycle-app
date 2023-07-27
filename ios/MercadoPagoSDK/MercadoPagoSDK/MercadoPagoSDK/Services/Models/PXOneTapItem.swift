//
//  PXOneTapItem.swift
//  MercadoPagoServices
//
//  Created by Eden Torres on 09/05/2018.
//  Copyright © 2018 Mercado Pago. All rights reserved.
//

import Foundation
/// :nodoc:
open class PXOneTapItem: NSObject, Codable {
    open var paymentMethodId: String
    open var paymentTypeId: String?
    open var oneTapCard: PXOneTapCard?

    public init(paymentMethodId: String, paymentTypeId: String?, oneTapCard: PXOneTapCard?) {
        self.paymentMethodId = paymentMethodId
        self.paymentTypeId = paymentTypeId
        self.oneTapCard = oneTapCard
    }

    public enum PXOneTapItemKeys: String, CodingKey {
        case paymentMethodId = "payment_method_id"
        case paymentTypeId = "payment_type_id"
        case oneTapCard = "card"
    }

    required public convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: PXOneTapItemKeys.self)
        let oneTapCard: PXOneTapCard? = try container.decodeIfPresent(PXOneTapCard.self, forKey: .oneTapCard)
        let paymentMethodId: String = try container.decode(String.self, forKey: .paymentMethodId)
        let paymentTypeId: String? = try container.decodeIfPresent(String.self, forKey: .paymentTypeId)

        self.init(paymentMethodId: paymentMethodId, paymentTypeId: paymentTypeId, oneTapCard: oneTapCard)
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: PXOneTapItemKeys.self)
        try container.encodeIfPresent(self.oneTapCard, forKey: .oneTapCard)
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

    open class func fromJSONToPXOneTapItem(data: Data) throws -> PXOneTapItem {
        return try JSONDecoder().decode(PXOneTapItem.self, from: data)
    }

    open class func fromJSON(data: Data) throws -> PXOneTapItem {
        return try JSONDecoder().decode(PXOneTapItem.self, from: data)
    }
}
