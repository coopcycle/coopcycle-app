//
//  PXFinantialInstitution.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 10/20/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation
/// :nodoc:
open class PXFinancialInstitution: NSObject, Codable {
    open var id: String = ""
    open var _description: String?

    public init(id: String, description: String?) {
        self.id = id
        self._description = description
    }

    public enum PXFinancialInstitutionKeys: String, CodingKey {
        case id
        case description = "description"
    }

    required public convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: PXFinancialInstitutionKeys.self)
        let id: String = try container.decode(String.self, forKey: .id)
        let description: String? = try container.decodeIfPresent(String.self, forKey: .description)

        self.init(id: id, description: description)
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: PXFinancialInstitutionKeys.self)
        try container.encodeIfPresent(self.id, forKey: .id)
        try container.encodeIfPresent(self._description, forKey: .description)
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

    open class func fromJSONToPXFinancialInstitution(data: Data) throws -> PXFinancialInstitution {
        return try JSONDecoder().decode(PXFinancialInstitution.self, from: data)
    }

    open class func fromJSON(data: Data) throws -> [PXFinancialInstitution] {
        return try JSONDecoder().decode([PXFinancialInstitution].self, from: data)
    }
}
