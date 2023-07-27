//
//  PXSplitPaymentMethod.swift
//  MercadoPagoSDKV4
//
//  Created by Eden Torres on 28/01/2019.
//

import Foundation

/// :nodoc:
open class PXSplitPaymentMethod: NSObject, Codable {
    open var amount: Double = 0
    open var id: String = ""
    open var discount: PXDiscount?
    open var message: String?
    open var selectedPayerCostIndex: Int?
    open var payerCosts: [PXPayerCost]?
    open var selectedPayerCost: PXPayerCost? {
        get {
            if let remotePayerCosts = payerCosts, let selectedIndex = selectedPayerCostIndex, remotePayerCosts.indices.contains(selectedIndex) {
                return remotePayerCosts[selectedIndex]
            }
            return nil
        }
    }

    init(amount: Double, id: String, discount: PXDiscount?, message: String?, selectedPayerCostIndex: Int?, payerCosts: [PXPayerCost]?) {
        self.amount = amount
        self.id = id
        self.discount = discount
        self.message = message
        self.selectedPayerCostIndex = selectedPayerCostIndex
        self.payerCosts = payerCosts
    }

    public enum PXPayerCostConfiguration: String, CodingKey {
        case amount = "amount"
        case id = "id"
        case discount = "discount"
        case message = "message"
        case selectedPayerCostIndex = "selected_payer_cost_index"
        case payerCosts = "payer_costs"
    }

    required public convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: PXPayerCostConfiguration.self)
        let amount: Double = try container.decodeIfPresent(Double.self, forKey: .amount) ?? 0
        let id: String = try container.decodeIfPresent(String.self, forKey: .id) ?? ""
        let discount: PXDiscount? = try container.decodeIfPresent(PXDiscount.self, forKey: .discount)
        let message: String? = try container.decodeIfPresent(String.self, forKey: .message)
        let selectedPayerCostIndex: Int? = try container.decodeIfPresent(Int.self, forKey: .selectedPayerCostIndex)
        let payerCosts: [PXPayerCost]? = try container.decodeIfPresent([PXPayerCost].self, forKey: .payerCosts)
        self.init(amount: amount, id: id, discount: discount, message: message, selectedPayerCostIndex: selectedPayerCostIndex, payerCosts: payerCosts)
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: PXPayerCostConfiguration.self)
        try container.encodeIfPresent(self.id, forKey: .id)
        try container.encodeIfPresent(self.amount, forKey: .amount)
        try container.encodeIfPresent(self.message, forKey: .message)
        try container.encodeIfPresent(self.discount, forKey: .discount)
        try container.encodeIfPresent(self.selectedPayerCostIndex, forKey: .selectedPayerCostIndex)
        try container.encodeIfPresent(self.payerCosts, forKey: .payerCosts)
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
}
