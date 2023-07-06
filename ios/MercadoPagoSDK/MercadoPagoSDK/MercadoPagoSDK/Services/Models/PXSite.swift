//
//  PXSite.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 10/20/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation
/// :nodoc:
open class PXSite: NSObject, Codable {

    open var id: String!
    open var currencyId: String?
    open var termsAndConditionsUrl: String
    open var shouldWarnAboutBankInterests: Bool?

    public init(id: String, currencyId: String?, termsAndConditionsUrl: String, shouldWarnAboutBankInterests: Bool?) {
        self.id = id
        self.currencyId = currencyId
        self.termsAndConditionsUrl = termsAndConditionsUrl
        self.shouldWarnAboutBankInterests = shouldWarnAboutBankInterests
    }

    public enum PXSiteKeys: String, CodingKey {
        case id
        case currencyId = "currency_id"
        case termsAndConditionsUrl = "terms_and_conditions_url"
        case shouldWarnAboutBankInterests = "should_warn_about_bank_interests"
    }

    required public convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: PXSiteKeys.self)
        let id: String = try container.decode(String.self, forKey: .id)
        let currencyId: String? = try container.decodeIfPresent(String.self, forKey: .currencyId)
        let termsAndConditionsUrl: String = try container.decode(String.self, forKey: .termsAndConditionsUrl)
        let shouldWarnAboutBankInterests: Bool? = try container.decodeIfPresent(Bool.self, forKey: .shouldWarnAboutBankInterests)
        self.init(id: id, currencyId: currencyId, termsAndConditionsUrl: termsAndConditionsUrl, shouldWarnAboutBankInterests: shouldWarnAboutBankInterests)
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: PXSiteKeys.self)
        try container.encodeIfPresent(self.id, forKey: .id)
        try container.encodeIfPresent(self.currencyId, forKey: .currencyId)
        try container.encodeIfPresent(self.termsAndConditionsUrl, forKey: .termsAndConditionsUrl)
        try container.encodeIfPresent(self.shouldWarnAboutBankInterests, forKey: .shouldWarnAboutBankInterests)
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

    open class func fromJSONToPXSite(data: Data) throws -> PXSite {
        return try JSONDecoder().decode(PXSite.self, from: data)
    }

    open class func fromJSON(data: Data) throws -> [PXSite] {
        return try JSONDecoder().decode([PXSite].self, from: data)
    }

}
