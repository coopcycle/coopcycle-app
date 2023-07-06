//
//  PXFeeDetail.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 10/20/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation
/// :nodoc:
open class PXFeeDetail: NSObject, Codable {
    open var amount: Double?
    open var feePayer: String?
    open var type: String?

    public init(amount: Double?, feePayer: String?, type: String?) {
        self.amount = amount
        self.feePayer = feePayer
        self.type = type
    }

    public enum PXFeeDetailKeys: String, CodingKey {
        case amount
        case feePayer = "fee_payer"
        case type
    }

    required public convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: PXFeeDetailKeys.self)
        let amount: Double? = try container.decodeIfPresent(Double.self, forKey: .amount)
        let feePayer: String? = try container.decodeIfPresent(String.self, forKey: .feePayer)
        let type: String? = try container.decodeIfPresent(String.self, forKey: .type)

        self.init(amount: amount, feePayer: feePayer, type: type)
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: PXFeeDetailKeys.self)
        try container.encodeIfPresent(self.amount, forKey: .amount)
        try container.encodeIfPresent(self.feePayer, forKey: .feePayer)
        try container.encodeIfPresent(self.type, forKey: .type)
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

    open class func fromJSONToPXFeeDetail(data: Data) throws -> PXFeeDetail {
        return try JSONDecoder().decode(PXFeeDetail.self, from: data)
    }

    open class func fromJSON(data: Data) throws -> [PXFeeDetail] {
        return try JSONDecoder().decode([PXFeeDetail].self, from: data)
    }

}
