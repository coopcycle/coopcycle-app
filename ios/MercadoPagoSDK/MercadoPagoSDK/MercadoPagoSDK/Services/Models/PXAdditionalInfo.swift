//
//  PXAdditionalInfo.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 4/8/19.
//

import Foundation

final class PXAdditionalInfo: NSObject, Codable {
    var pxSummary: PXAdditionalInfoSummary?

    public init(pxSummary: PXAdditionalInfoSummary?) {
        self.pxSummary = pxSummary
    }

    public enum PXAdditionalInfoKeys: String, CodingKey {
        case pxSummary = "px_summary"
    }

    required public convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: PXAdditionalInfoKeys.self)
        let summary: PXAdditionalInfoSummary? = try container.decodeIfPresent(PXAdditionalInfoSummary.self, forKey: .pxSummary)
        self.init(pxSummary: summary)
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: PXAdditionalInfoKeys.self)
        try container.encodeIfPresent(self.pxSummary, forKey: .pxSummary)
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

    class func fromJSON(data: Data) throws -> PXAdditionalInfo {
        return try JSONDecoder().decode(PXAdditionalInfo.self, from: data)
    }
}
