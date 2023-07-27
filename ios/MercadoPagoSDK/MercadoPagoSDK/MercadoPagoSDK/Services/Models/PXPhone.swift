//
//  PXPhone.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 10/20/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation
/// :nodoc:
open class PXPhone: NSObject, Codable {

    open var areaCode: String?
    open var number: String?

    public init(areaCode: String?, number: String?) {
        self.areaCode = areaCode
        self.number = number
    }

    public enum PXPhoneKeys: String, CodingKey {
        case areaCode = "area_code"
        case number = "number"
    }

    required public convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: PXPhoneKeys.self)
        let areaCode: String? = try container.decodeIfPresent(String.self, forKey: .areaCode)
        let number: String? = try container.decodeIfPresent(String.self, forKey: .number)

        self.init(areaCode: areaCode, number: number)
    }
    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: PXPhoneKeys.self)
        try container.encodeIfPresent(self.areaCode, forKey: .areaCode)
        try container.encodeIfPresent(self.number, forKey: .number)
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

    open class func fromJSONToPXPhone(data: Data) throws -> PXPhone {
        return try JSONDecoder().decode(PXPhone.self, from: data)
    }

    open class func fromJSON(data: Data) throws -> [PXPhone] {
        return try JSONDecoder().decode([PXPhone].self, from: data)
    }

}
