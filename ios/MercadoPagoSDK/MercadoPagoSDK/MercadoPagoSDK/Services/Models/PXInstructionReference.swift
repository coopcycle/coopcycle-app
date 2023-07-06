//
//  PXInstructionReference.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 10/20/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation
/// :nodoc:
open class PXInstructionReference: NSObject, Codable {

    open var label: String?
    open var fieldValue: [String] = []
    open var separator: String = ""
    open var comment: String?

    public init(label: String?, fieldValue: [String], separator: String, comment: String?) {
        self.label = label
        self.fieldValue = fieldValue
        self.separator = separator
        self.comment = comment
    }

    public enum PXInstructionReferenceKeys: String, CodingKey {
        case label
        case fieldValue = "field_value"
        case separator
        case comment
    }

    required public convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: PXInstructionReferenceKeys.self)
        let label: String? = try container.decodeIfPresent(String.self, forKey: .label)
        let fieldValue: [String] = try container.decodeIfPresent([String].self, forKey: .fieldValue) ?? []
        let separator: String = try container.decodeIfPresent(String.self, forKey: .separator) ?? ""
        let comment: String? = try container.decodeIfPresent(String.self, forKey: .comment)

        self.init(label: label, fieldValue: fieldValue, separator: separator, comment: comment)
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: PXInstructionReferenceKeys.self)
        try container.encodeIfPresent(self.label, forKey: .label)
        try container.encodeIfPresent(self.fieldValue, forKey: .fieldValue)
        try container.encodeIfPresent(self.separator, forKey: .separator)
        try container.encodeIfPresent(self.comment, forKey: .comment)

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

    open class func fromJSONToPXInstructionReference(data: Data) throws -> PXInstructionReference {
        return try JSONDecoder().decode(PXInstructionReference.self, from: data)
    }

    open class func fromJSON(data: Data) throws -> [PXInstructionReference] {
        return try JSONDecoder().decode([PXInstructionReference].self, from: data)
    }
}
