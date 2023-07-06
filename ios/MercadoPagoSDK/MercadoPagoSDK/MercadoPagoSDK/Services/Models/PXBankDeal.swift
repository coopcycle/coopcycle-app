//
//  PXBankDeal.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 10/20/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

/// :nodoc:
open class PXBankDeal: NSObject, Codable {
    open var id: String!
    open var dateExpired: Date?
    open var dateStarted: Date?
    open var installments: [Int]?
    open var issuer: PXIssuer?
    open var legals: String?
    open var picture: PXPicture?
    open var maxInstallments: Int?
    open var paymentMethods: [PXPaymentMethod]?
    open var recommendedMessage: String?
    open var totalFinancialCost: Double?

    public init(id: String, dateExpired: Date?, dateStarted: Date?, installments: [Int]?, issuer: PXIssuer?, legals: String?, picture: PXPicture?, maxInstallments: Int?, paymentMethods: [PXPaymentMethod]?, recommendedMessage: String?, totalFinancialCost: Double?) {
        self.id = id
        self.dateExpired = dateExpired
        self.dateStarted = dateStarted
        self.installments = installments
        self.issuer = issuer
        self.legals = legals
        self.picture = picture
        self.maxInstallments = maxInstallments
        self.paymentMethods = paymentMethods
        self.recommendedMessage = recommendedMessage
        self.totalFinancialCost = totalFinancialCost
    }

    public enum PXBankDealKeys: String, CodingKey {
        case id
        case dateExpired = "date_expired"
        case dateStarted = "date_started"
        case installments
        case issuer
        case legals
        case picture
        case maxInstallments = "max_installments"
        case paymentMethods = "payment_methods"
        case recommendedMessage = "recommended_message"
        case totalFinancialCost = "total_financial_cost"
    }

    required public convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: PXBankDealKeys.self)
        let installments: [Int]? = try container.decodeIfPresent([Int].self, forKey: .installments)
        let dateExpired: Date? = try container.decodeDateFromStringIfPresent(forKey: .dateExpired)
        let dateStarted: Date? = try container.decodeDateFromStringIfPresent(forKey: .dateStarted)
        let maxInstallments: Int? = try container.decodeIfPresent(Int.self, forKey: .maxInstallments)
        let paymentMethods: [PXPaymentMethod]? = try container.decodeIfPresent([PXPaymentMethod].self, forKey: .paymentMethods)
        let id: String = try container.decode(String.self, forKey: .id)
        let issuer: PXIssuer? = try container.decodeIfPresent(PXIssuer.self, forKey: .issuer)
        let legals: String? = try container.decodeIfPresent(String.self, forKey: .legals)
        let picture: PXPicture? = try container.decodeIfPresent(PXPicture.self, forKey: .picture)
        let recommendedMessage: String? = try container.decodeIfPresent(String.self, forKey: .recommendedMessage)
        let totalFinancialCost: Double? = try container.decodeIfPresent(Double.self, forKey: .totalFinancialCost)

        self.init(id: id, dateExpired: dateExpired, dateStarted: dateStarted, installments: installments, issuer: issuer, legals: legals, picture: picture, maxInstallments: maxInstallments, paymentMethods: paymentMethods, recommendedMessage: recommendedMessage, totalFinancialCost: totalFinancialCost)
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: PXBankDealKeys.self)
        try container.encodeIfPresent(self.installments, forKey: .installments)
        try container.encodeIfPresent(self.maxInstallments, forKey: .maxInstallments)
        try container.encodeIfPresent(self.paymentMethods, forKey: .paymentMethods)
        try container.encodeIfPresent(self.id, forKey: .id)
        try container.encodeIfPresent(self.issuer, forKey: .issuer)
        try container.encodeIfPresent(self.legals, forKey: .legals)
        try container.encodeIfPresent(self.picture, forKey: .picture)
        try container.encodeIfPresent(self.recommendedMessage, forKey: .recommendedMessage)
        try container.encodeIfPresent(self.totalFinancialCost, forKey: .totalFinancialCost)
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

    open class func fromJSONToPXBankDeal(data: Data) throws -> PXBankDeal {
        return try JSONDecoder().decode(PXBankDeal.self, from: data)
    }

    open class func fromJSON(data: Data) throws -> [PXBankDeal] {
        return try JSONDecoder().decode([PXBankDeal].self, from: data)
    }

}
