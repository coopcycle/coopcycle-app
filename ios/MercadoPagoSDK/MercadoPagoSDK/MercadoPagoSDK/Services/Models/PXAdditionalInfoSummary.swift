//
//  PXAdditionalInfoSummary.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 4/8/19.
//

import Foundation

final class PXAdditionalInfoSummary: NSObject, Codable {
    var title: String?
    var subtitle: String?
    var purpose: String?
    var imageUrl: String?
    var charges: String?

    init(title: String?, subtitle: String?, purpose: String?, imageUrl: String?, charges: String?) {
        self.title = title
        self.subtitle = subtitle
        self.purpose = purpose
        self.imageUrl = imageUrl
        self.charges = charges
    }

    enum PXAdditionalInfoSummaryKeys: String, CodingKey {
        case title
        case subtitle
        case purpose
        case imageUrl = "image_url"
        case charges
    }

    required convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: PXAdditionalInfoSummaryKeys.self)
        let title: String? = try container.decodeIfPresent(String.self, forKey: .title)
        let subtitle: String? = try container.decodeIfPresent(String.self, forKey: .subtitle)
        let purpose: String? = try container.decodeIfPresent(String.self, forKey: .purpose)
        let imageUrl: String? = try container.decodeIfPresent(String.self, forKey: .imageUrl)
        let charges: String? = try container.decodeIfPresent(String.self, forKey: .charges)
        self.init(title: title, subtitle: subtitle, purpose: purpose, imageUrl: imageUrl, charges: charges)
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: PXAdditionalInfoSummaryKeys.self)
        try container.encodeIfPresent(self.title, forKey: .title)
        try container.encodeIfPresent(self.subtitle, forKey: .subtitle)
        try container.encodeIfPresent(self.purpose, forKey: .purpose)
        try container.encodeIfPresent(self.imageUrl, forKey: .imageUrl)
        try container.encodeIfPresent(self.charges, forKey: .charges)
    }

    func toJSONString() throws -> String? {
        let encoder = JSONEncoder()
        let data = try encoder.encode(self)
        return String(data: data, encoding: .utf8)
    }

    func toJSON() throws -> Data {
        let encoder = JSONEncoder()
        return try encoder.encode(self)
    }

    class func fromJSON(data: Data) throws -> PXAdditionalInfoSummary {
        return try JSONDecoder().decode(PXAdditionalInfoSummary.self, from: data)
    }
}
