//
//  PXAccountMoneyDto.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 23/10/18.
//

import Foundation

/// :nodoc:
open class PXAccountMoneyDto: NSObject, Codable {
    open var availableBalance: Double = 0
    open var invested: Bool = false
    open var cardTitle: String?
    open var sliderTitle: String?

    public init(availableBalance: Double, invested: Bool, sliderTitle: String?, cardTitle: String?) {
        self.availableBalance = availableBalance
        self.invested = invested
        self.cardTitle = cardTitle
        self.sliderTitle = sliderTitle
    }

    public enum PXAccountMoneyKeys: String, CodingKey {
        case availableBalance = "available_balance"
        case invested
        case displayInfo = "display_info"
        case cardTitle = "message"
        case sliderTitle = "slider_title"
    }

    required public convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: PXAccountMoneyKeys.self)
        let invested: Bool = try container.decode(Bool.self, forKey: .invested)
        let availableBalance: Double = try container.decode(Double.self, forKey: .availableBalance)
        let display_info = try container.nestedContainer(keyedBy: PXAccountMoneyKeys.self, forKey: .displayInfo)
        let cardTitle: String? = try display_info.decodeIfPresent(String.self, forKey: .cardTitle)
        let sliderTitle: String? = try display_info.decodeIfPresent(String.self, forKey: .sliderTitle)
        self.init(availableBalance: availableBalance, invested: invested, sliderTitle: sliderTitle, cardTitle: cardTitle)
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: PXAccountMoneyKeys.self)
        try container.encode(self.availableBalance, forKey: .availableBalance)
        try container.encode(self.invested, forKey: .invested)
        try container.encodeIfPresent(self.sliderTitle, forKey: .sliderTitle)
        try container.encodeIfPresent(self.cardTitle, forKey: .cardTitle)
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

    open class func fromJSON(data: Data) throws -> PXAccountMoneyDto {
        return try JSONDecoder().decode(PXAccountMoneyDto.self, from: data)
    }
}
