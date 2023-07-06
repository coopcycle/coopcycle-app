//
//  PXCurrency.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 10/20/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation
/// :nodoc:
open class PXCurrency: NSObject, Codable {

    open var id: String!
    open var _description: String?
    open var symbol: String?
    open var decimalPlaces: Int?
    open var decimalSeparator: String?
    open var thousandSeparator: String?

    public init (id: String, description: String?, symbol: String?, decimalPlaces: Int?, decimalSeparator: String?, thousandSeparator: String?) {
        self.id = id
        self._description = description
        self.symbol = symbol
        self.decimalPlaces = decimalPlaces
        self.decimalSeparator = decimalSeparator
        self.thousandSeparator = thousandSeparator
    }

    public enum PXCurrencyKeys: String, CodingKey {
        case id
        case description
        case symbol
        case decimalPlaces = "decimal_places"
        case decimalSeparator = "decimal_separator"
        case thousandSeparator = "thousands_separator"
    }

    required public convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: PXCurrencyKeys.self)
        let description: String? = try container.decodeIfPresent(String.self, forKey: .description)
        let id: String = try container.decode(String.self, forKey: .id)
        let symbol: String? = try container.decodeIfPresent(String.self, forKey: .symbol)
        let decimalPlaces: Int? = try container.decodeIfPresent(Int.self, forKey: .decimalPlaces)
        let decimalSeparator: String? = try container.decodeIfPresent(String.self, forKey: .decimalSeparator)
        let thousandSeparator: String? = try container.decodeIfPresent(String.self, forKey: .thousandSeparator)

        self.init(id: id, description: description, symbol: symbol, decimalPlaces: decimalPlaces, decimalSeparator: decimalSeparator, thousandSeparator: thousandSeparator)
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: PXCurrencyKeys.self)
        try container.encodeIfPresent(self._description, forKey: .description)
        try container.encodeIfPresent(self.id, forKey: .id)
        try container.encodeIfPresent(self.symbol, forKey: .symbol)
        try container.encodeIfPresent(self.decimalPlaces, forKey: .decimalPlaces)
        try container.encodeIfPresent(self.decimalSeparator, forKey: .decimalSeparator)
        try container.encodeIfPresent(self.thousandSeparator, forKey: .thousandSeparator)

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

    open class func fromJSONToPXCurrency(data: Data) throws -> PXCurrency {
        return try JSONDecoder().decode(PXCurrency.self, from: data)
    }

    open class func fromJSON(data: Data) throws -> [PXCurrency] {
        return try JSONDecoder().decode([PXCurrency].self, from: data)
    }
}
