//
//  PXRefund.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 10/20/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation
/// :nodoc:
open class PXRefund: NSObject, Codable {
    open var dateCreated: Date?
    open var id: String!
    open var metadata: [String: String]?
    open var paymentId: Int64?
    open var source: String?
    open var uniqueSecuenceNumber: String?

    public init(id: String, dateCreated: Date?, metadata: [String: String]?, paymentId: Int64?, source: String?, uniqueSecuenceNumber: String?) {
        self.dateCreated = dateCreated
        self.id = id
        self.metadata = metadata
        self.paymentId = paymentId
        self.source = source
        self.uniqueSecuenceNumber = uniqueSecuenceNumber
    }

    public enum PXRefundKeys: String, CodingKey {
        case dateCreated = "date_created"
        case id
        case metadata
        case paymentId = "payment_id"
        case source = "source"
        case uniqueSecuenceNumber = "unique_secuence_number"
    }

    required public convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: PXRefundKeys.self)
        let metadata: [String: String]? = try container.decodeIfPresent([String: String].self, forKey: .metadata)
        let dateCreated: Date? = try container.decodeDateFromStringIfPresent(forKey: .dateCreated)
        let id: String = try container.decode(String.self, forKey: .id)
        let paymentId: Int64? = try container.decodeIfPresent(Int64.self, forKey: .paymentId)
        let source: String? = try container.decodeIfPresent(String.self, forKey: .source)
        let uniqueSecuenceNumber: String? = try container.decodeIfPresent(String.self, forKey: .uniqueSecuenceNumber)

        self.init(id: id, dateCreated: dateCreated, metadata: metadata, paymentId: paymentId, source: source, uniqueSecuenceNumber: uniqueSecuenceNumber)
    }
    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: PXRefundKeys.self)
        try container.encodeIfPresent(self.metadata, forKey: .metadata)
        try container.encodeIfPresent(self.id, forKey: .id)
        try container.encodeIfPresent(self.paymentId, forKey: .paymentId)
        try container.encodeIfPresent(self.source, forKey: .source)
        try container.encodeIfPresent(self.uniqueSecuenceNumber, forKey: .uniqueSecuenceNumber)
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

    open class func fromJSONToPXRefund(data: Data) throws -> PXRefund {
        return try JSONDecoder().decode(PXRefund.self, from: data)
    }

    open class func fromJSON(data: Data) throws -> [PXRefund] {
        return try JSONDecoder().decode([PXRefund].self, from: data)
    }

}
