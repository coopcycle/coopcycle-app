//
//  PXSummaryAmount.swift
//  FXBlurView
//
//  Created by Demian Tejo on 13/12/18.
//

import Foundation

class PXSummaryAmount: NSObject, Codable {
    let amountConfigurations: [String: PXAmountConfiguration]?
    let discountConfigurations: [String: PXDiscountConfiguration]?
    let defaultAmountConfigurationId: String

    var selectedAmountConfiguration: PXPaymentOptionConfiguration {
        get {
            return PXPaymentOptionConfiguration(id: defaultAmountConfigurationId, discountConfiguration: discountConfigurations?[defaultAmountConfigurationId], payerCostConfiguration: amountConfigurations?[defaultAmountConfigurationId])
        }
    }

    init(amountConfigurations: [String: PXAmountConfiguration]?, discountConfigurations: [String: PXDiscountConfiguration]?, defaultAmountConfigurationId: String) {
        self.amountConfigurations = amountConfigurations
        self.discountConfigurations = discountConfigurations
        self.defaultAmountConfigurationId = defaultAmountConfigurationId
    }

    public enum PXSummaryAmountKeys: String, CodingKey {
        case amountConfigurations = "amount_configurations"
        case discountConfigurations = "discounts_configurations"
        case defaultAmountConfigurationId = "default_amount_configuration"
    }
    required public convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: PXSummaryAmountKeys.self)
        let discountConfigurations: [String: PXDiscountConfiguration]? = try container.decodeIfPresent([String: PXDiscountConfiguration].self, forKey: .discountConfigurations)
        let amountConfigurations: [String: PXAmountConfiguration]? = try container.decodeIfPresent([String: PXAmountConfiguration].self, forKey: .amountConfigurations)
        let defaultAmountConfigurationId: String? = try container.decodeIfPresent(String.self, forKey: .defaultAmountConfigurationId)

        self.init(amountConfigurations: amountConfigurations, discountConfigurations: discountConfigurations, defaultAmountConfigurationId: defaultAmountConfigurationId!)
    }
    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: PXSummaryAmountKeys.self)
        try container.encodeIfPresent(self.amountConfigurations, forKey: .amountConfigurations)
        try container.encodeIfPresent(self.discountConfigurations, forKey: .discountConfigurations)
        try container.encodeIfPresent(self.defaultAmountConfigurationId, forKey: .defaultAmountConfigurationId)
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
    open class func fromJSON(data: Data) throws -> PXSummaryAmount {
        return try JSONDecoder().decode(PXSummaryAmount.self, from: data)
    }
}
