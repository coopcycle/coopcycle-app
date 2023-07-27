//
//  PXAddress.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 10/20/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation
/// :nodoc:
open class PXAddress: NSObject, Codable {

    open var streetName: String?
    open var streetNumber: Int64?
    open var zipCode: String?

    public init(streetName: String?, streetNumber: Int64?, zipCode: String?) {
        self.streetName = streetName
        self.streetNumber = streetNumber
        self.zipCode = zipCode
    }

    public enum PXAddressKeys: String, CodingKey {
        case streetName = "street_name"
        case streetNumber = "street_number"
        case zipCode = "zip_code"
    }

    required public convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: PXAddressKeys.self)
        let streetName = try container.decodeIfPresent(String.self, forKey: .streetName)
        let streetNumber = try container.decodeIfPresent(Int64.self, forKey: .streetNumber)
        let zipCode = try container.decodeIfPresent(String.self, forKey: .zipCode)

        self.init(streetName: streetName, streetNumber: streetNumber, zipCode: zipCode)
    }

     public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: PXAddressKeys.self)
        try container.encodeIfPresent(self.streetName, forKey: .streetName)
        try container.encodeIfPresent(self.streetNumber, forKey: .streetNumber)
        try container.encodeIfPresent(self.zipCode, forKey: .zipCode)

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

    open class func fromJSONToPXAddress(data: Data) throws -> PXAddress {
        return try JSONDecoder().decode(PXAddress.self, from: data)
    }

    open class func fromJSON(data: Data) throws -> [PXAddress] {
        return try JSONDecoder().decode([PXAddress].self, from: data)
    }

}
