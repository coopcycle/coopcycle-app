//
//  PXSetting.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 10/20/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation
/// :nodoc:
open class PXSetting: NSObject, Codable {

    open var bin: PXBin?
    open var cardNumber: PXCardNumber?
    open var securityCode: PXSecurityCode?

    public init(bin: PXBin?, cardNumber: PXCardNumber?, securityCode: PXSecurityCode?) {
        self.bin = bin
        self.cardNumber = cardNumber
        self.securityCode = securityCode
    }

    public enum PXSettingKeys: String, CodingKey {
        case bin
        case cardNumber = "card_number"
        case securityCode = "security_code"
    }

    required public convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: PXSettingKeys.self)
        let bin: PXBin? = try container.decodeIfPresent(PXBin.self, forKey: .bin)
        let cardNumber: PXCardNumber? = try container.decodeIfPresent(PXCardNumber.self, forKey: .cardNumber)
        let securityCode: PXSecurityCode? = try container.decodeIfPresent(PXSecurityCode.self, forKey: .securityCode)

        self.init(bin: bin, cardNumber: cardNumber, securityCode: securityCode)
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: PXSettingKeys.self)
        try container.encodeIfPresent(self.bin, forKey: .bin)
        try container.encodeIfPresent(self.cardNumber, forKey: .cardNumber)
        try container.encodeIfPresent(self.securityCode, forKey: .securityCode)
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

    open class func fromJSONToPXSetting(data: Data) throws -> PXSetting {
        return try JSONDecoder().decode(PXSetting.self, from: data)
    }

    open class func fromJSON(data: Data) throws -> [PXSetting] {
        return try JSONDecoder().decode([PXSetting].self, from: data)
    }
}
