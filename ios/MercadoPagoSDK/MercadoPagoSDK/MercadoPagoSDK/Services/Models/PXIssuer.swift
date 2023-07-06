//
//  PXIssuer.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 10/20/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation
/// :nodoc:
@objcMembers
open class PXIssuer: NSObject, Codable {
    open var id: String = ""
    open var name: String?

    public init(id: String, name: String?) {
        self.id = id
        self.name = name
    }

    public enum PXIssuerKeys: String, CodingKey {
        case id
        case name
    }

    required public convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: PXIssuerKeys.self)
        let name: String? = try container.decodeIfPresent(String.self, forKey: .name)
        var id = ""
        do {
            let intId = try container.decodeIfPresent(Int.self, forKey: .id)
            id = (intId?.stringValue)!
        } catch {
            let stringId = try container.decodeIfPresent(String.self, forKey: .id)
            id = stringId!
        }

        self.init(id: id, name: name)
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

    open class func fromJSONToPXIssuer(data: Data) throws -> PXIssuer {
        return try JSONDecoder().decode(PXIssuer.self, from: data)
    }

    open class func fromJSON(data: Data) throws -> [PXIssuer] {
        return try JSONDecoder().decode([PXIssuer].self, from: data)
    }
}

// MARK: Getters
extension PXIssuer {
    /// :nodoc:
    @objc
    public func getId() -> String? {
        return id
    }
}
