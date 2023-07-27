//
//  PXDifferentialPricing.swift
//  MercadoPagoServicesV4
//
//  Created by Demian Tejo on 30/7/18.
//

import Foundation
/// :nodoc:
open class PXDifferentialPricing: NSObject, Codable {

    open var id: Int64?

    public init(id: Int64?) {
        self.id = id
        super.init()
    }
    public enum PXDifferentialPricingKeys: String, CodingKey {
        case id
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: PXDifferentialPricingKeys.self)
        try container.encodeIfPresent(self.id, forKey: .id)
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

    open class func fromJSON(data: Data) throws -> PXDifferentialPricing {
        return try JSONDecoder().decode(PXDifferentialPricing.self, from: data)
    }
}
