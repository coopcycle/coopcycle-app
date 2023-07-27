//
//  PXIdentificationType.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 10/20/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation
/// :nodoc:
open class PXIdentificationType: NSObject, Codable {
    open var id: String!
    open var name: String?
    open var minLength: Int = 0
    open var maxLength: Int = 0
    open var type: String?

    public init(id: String, name: String?, minLength: Int, maxLength: Int, type: String?) {
        self.id = id
        self.name = name
        self.minLength = minLength
        self.maxLength = maxLength
        self.type = type
    }

    public enum PXIdentificationTypeKeys: String, CodingKey {
        case id
        case name
        case minLength = "min_length"
        case maxLength = "max_length"
        case type
    }

    required public convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: PXIdentificationTypeKeys.self)
        let minLength: Int = try container.decodeIfPresent(Int.self, forKey: .minLength) ?? 0
        let maxLength: Int = try container.decodeIfPresent(Int.self, forKey: .maxLength) ?? 0
        let id: String = try container.decode(String.self, forKey: .id)
        let name: String? = try container.decodeIfPresent(String.self, forKey: .name)
        let type: String? = try container.decodeIfPresent(String.self, forKey: .type)

        self.init(id: id, name: name, minLength: minLength, maxLength: maxLength, type: type)
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: PXIdentificationTypeKeys.self)
        try container.encodeIfPresent(self.minLength, forKey: .minLength)
        try container.encodeIfPresent(self.maxLength, forKey: .maxLength)
        try container.encodeIfPresent(self.id, forKey: .id)
        try container.encodeIfPresent(self.name, forKey: .name)
        try container.encodeIfPresent(self.type, forKey: .type)
    }

    internal func isNumberType() -> Bool {
        return self.type == "number"
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

    open class func fromJSONToPXIdentificationType(data: Data) throws -> PXIdentificationType {
        return try JSONDecoder().decode(PXIdentificationType.self, from: data)
    }

    open class func fromJSON(data: Data) throws -> [PXIdentificationType] {
        return try JSONDecoder().decode([PXIdentificationType].self, from: data)
    }

    internal func validate(identification: String) -> Bool {
        if id == "CPF" {
            return IdentificationTypeValidator().validate(cpf: identification)
        }
        if id == "CNPJ" {
            return IdentificationTypeValidator().validate(cpf: identification)
        }
        return true
    }

}
