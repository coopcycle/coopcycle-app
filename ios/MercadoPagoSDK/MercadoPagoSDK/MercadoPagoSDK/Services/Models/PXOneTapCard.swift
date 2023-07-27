//
//  PXOneTapCard.swift
//  MercadoPagoServices
//
//  Created by Eden Torres on 09/05/2018.
//  Copyright © 2018 Mercado Pago. All rights reserved.
//

import Foundation
/// :nodoc:
open class PXOneTapCard: NSObject, Codable {
    open var cardId: String
    open var selectedPayerCost: PXPayerCost?

    public init(cardId: String, selectedPayerCost: PXPayerCost?) {
        self.cardId = cardId
        self.selectedPayerCost = selectedPayerCost
    }

    public enum PXOneTapCardKeys: String, CodingKey {
        case cardId = "id"
        case selectedPayerCost = "selected_payer_cost"
    }

    required public convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: PXOneTapCardKeys.self)
        let payerCost: PXPayerCost? = try container.decodeIfPresent(PXPayerCost.self, forKey: .selectedPayerCost)
        let cardId: String = try container.decode(String.self, forKey: .cardId)

        self.init(cardId: cardId, selectedPayerCost: payerCost)
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: PXOneTapCardKeys.self)
        try container.encodeIfPresent(self.selectedPayerCost, forKey: .selectedPayerCost)
        try container.encodeIfPresent(self.cardId, forKey: .cardId)
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

    open class func fromJSONToPXOneTapCard(data: Data) throws -> PXOneTapCard {
        return try JSONDecoder().decode(PXOneTapCard.self, from: data)
    }

    open class func fromJSON(data: Data) throws -> PXOneTapCard {
        return try JSONDecoder().decode(PXOneTapCard.self, from: data)
    }

}
