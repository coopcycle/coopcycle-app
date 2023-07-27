//
//  PXPayerCost.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 10/20/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation
/// :nodoc:
@objcMembers
open class PXPayerCost: NSObject, Codable {

    open var installmentRate: Double = 0
    open var labels: [String] = []
    open var minAllowedAmount: Double = 0
    open var maxAllowedAmount: Double = 0
    open var recommendedMessage: String?
    open var installmentAmount: Double = 0
    open var totalAmount: Double = 0
    open var installments: Int = 0
    open var processingMode: String?
    open var paymentMethodOptionId: String?
    open var agreements: [PXAgreement] = []

    public init(installmentRate: Double, labels: [String], minAllowedAmount: Double, maxAllowedAmount: Double, recommendedMessage: String?, installmentAmount: Double, totalAmount: Double, installments: Int, processingMode: String?, paymentMethodOptionId: String?, agreements: [PXAgreement] = []) {
        self.installmentRate = installmentRate
        self.labels = labels
        self.minAllowedAmount = minAllowedAmount
        self.maxAllowedAmount = maxAllowedAmount
        self.recommendedMessage = recommendedMessage
        self.installmentAmount = installmentAmount
        self.totalAmount = totalAmount
        self.installments = installments
        self.processingMode = processingMode
        self.paymentMethodOptionId = paymentMethodOptionId
        self.agreements = agreements
    }

    public enum PXPayerCostKeys: String, CodingKey {
        case installmentRate = "installment_rate"
        case labels
        case minAllowedAmount = "min_allowed_amount"
        case maxAllowedAmount = "max_allowed_amount"
        case recommendedMessage = "recommended_message"
        case installmentAmount = "installment_amount"
        case totalAmount = "total_amount"
        case installments
        case processingMode = "processing_mode"
        case paymentMethodOptionId = "payment_method_option_id"
        case agreements
    }

    required public convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: PXPayerCostKeys.self)
        let installmentRate: Double = try container.decodeIfPresent(Double.self, forKey: .installmentRate) ?? 0
        let labels: [String] = try container.decodeIfPresent([String].self, forKey: .labels) ?? []
        let minAllowedAmount: Double = try container.decodeIfPresent(Double.self, forKey: .minAllowedAmount) ?? 0
        let maxAllowedAmount: Double = try container.decodeIfPresent(Double.self, forKey: .maxAllowedAmount) ?? 0
        let recommendedMessage: String? = try container.decodeIfPresent(String.self, forKey: .recommendedMessage)
        let installmentAmount: Double = try container.decodeIfPresent(Double.self, forKey: .installmentAmount) ?? 0
        let totalAmount: Double = try container.decodeIfPresent(Double.self, forKey: .totalAmount) ?? 0
        let installments: Int = try container.decodeIfPresent(Int.self, forKey: .installments) ?? 0
        let processingMode: String? = try container.decodeIfPresent(String.self, forKey: .processingMode)
        let paymentMethodOptionId: String? = try container.decodeIfPresent(String.self, forKey: .paymentMethodOptionId)
        let agreements: [PXAgreement] = try container.decodeIfPresent([PXAgreement].self, forKey: .agreements) ?? []

        self.init(installmentRate: installmentRate, labels: labels, minAllowedAmount: minAllowedAmount, maxAllowedAmount: maxAllowedAmount, recommendedMessage: recommendedMessage, installmentAmount: installmentAmount, totalAmount: totalAmount, installments: installments,processingMode: processingMode, paymentMethodOptionId: paymentMethodOptionId, agreements: agreements)
    }

    public func encode(to encoder: Encoder) throws {
        var container = try encoder.container(keyedBy: PXPayerCostKeys.self)
        try container.encodeIfPresent(self.installmentRate, forKey: .installmentRate)
        try container.encodeIfPresent(self.labels, forKey: .labels)
        try container.encodeIfPresent(self.minAllowedAmount, forKey: .minAllowedAmount)
        try container.encodeIfPresent(self.maxAllowedAmount, forKey: .maxAllowedAmount)
        try container.encodeIfPresent(self.recommendedMessage, forKey: .recommendedMessage)
        try container.encodeIfPresent(self.installmentAmount, forKey: .installmentAmount)
        try container.encodeIfPresent(self.totalAmount, forKey: .totalAmount)
        try container.encodeIfPresent(self.installments, forKey: .installments)
        try container.encodeIfPresent(self.processingMode, forKey: .processingMode)
        try container.encodeIfPresent(self.paymentMethodOptionId, forKey: .paymentMethodOptionId)
        try container.encodeIfPresent(self.agreements, forKey: .agreements)
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

    open class func fromJSONToPXPayerCost(data: Data) throws -> PXPayerCost {
        return try JSONDecoder().decode(PXPayerCost.self, from: data)
    }

    open class func fromJSON(data: Data) throws -> [PXPayerCost] {
        return try JSONDecoder().decode([PXPayerCost].self, from: data)
    }

}
