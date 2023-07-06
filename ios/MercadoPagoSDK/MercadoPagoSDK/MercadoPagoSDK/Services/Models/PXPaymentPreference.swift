//
//  PXPaymentPreference.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 10/23/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

/// :nodoc:
open class PXPaymentPreference: NSObject, Codable {

    open var maxAcceptedInstallments: Int = 0
    open var defaultInstallments: Int?
    open var excludedPaymentMethodIds: [String] = []
    open var excludedPaymentTypeIds: [String] = []
    open var defaultPaymentMethodId: String?
    open var defaultPaymentTypeId: String?
    open var cardId: String?

    override public init() {

    }

    public init(maxAcceptedInstallments: Int, defaultInstallments: Int?, excludedPaymentMethodIds: [String], excludedPaymentTypeIds: [String], defaultPaymentMethodId: String?, defaultPaymentTypeId: String?) {
        self.maxAcceptedInstallments = maxAcceptedInstallments
        self.defaultInstallments = defaultInstallments
        self.excludedPaymentMethodIds = excludedPaymentMethodIds
        self.excludedPaymentTypeIds = excludedPaymentTypeIds
        self.defaultPaymentMethodId = defaultPaymentMethodId
        self.defaultPaymentTypeId = defaultPaymentTypeId
    }

    init(maxAcceptedInstallments: Int, defaultInstallments: Int?, excludedPaymentMethods: [PXPaymentMethod], excludedPaymentTypes: [PXPaymentType], defaultPaymentMethodId: String?, defaultPaymentTypeId: String?, defaultCardId: String?) {

        var excludedPaymentTypeIds: [String] = []
        for paymentType in excludedPaymentTypes {
            if !String.isNullOrEmpty(paymentType.id) {
                excludedPaymentTypeIds.append(paymentType.id)
            }
        }

        var excludedPaymentMethodIds: [String] = []
        for paymentMethod in excludedPaymentMethods {
            if !String.isNullOrEmpty(paymentMethod.id) {
                excludedPaymentMethodIds.append(paymentMethod.id)
            }
        }

        self.maxAcceptedInstallments = maxAcceptedInstallments
        self.defaultInstallments = defaultInstallments
        self.excludedPaymentMethodIds = excludedPaymentMethodIds
        self.excludedPaymentTypeIds = excludedPaymentTypeIds
        self.defaultPaymentMethodId = defaultPaymentMethodId
        self.defaultPaymentTypeId = defaultPaymentTypeId
        self.cardId = defaultCardId
    }

    public enum PXPaymentPreferenceKeys: String, CodingKey {
        case maxAcceptedInstallments = "installments"
        case defaultInstallments = "default_installments"
        case excludedPaymentMethodIds = "excluded_payment_methods"
        case excludedPaymentTypeIds = "excluded_payment_types"
        case defaultPaymentMethodId = "default_payment_method_id"
        case defaultPaymentTypeId = "default_payment_type_id"
        case defaultCardId = "default_card_id"
    }

    required public convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: PXPaymentPreferenceKeys.self)
        let defaultInstallments: Int? = try container.decodeIfPresent(Int.self, forKey: .defaultInstallments)
        let maxAcceptedInstallments: Int = try container.decodeIfPresent(Int.self, forKey: .maxAcceptedInstallments) ?? 0
        let excludedPaymentMethods: [PXPaymentMethod] = try container.decodeIfPresent([PXPaymentMethod].self, forKey: .excludedPaymentMethodIds) ?? []
        let excludedPaymentTypes: [PXPaymentType] = try container.decodeIfPresent([PXPaymentType].self, forKey: .excludedPaymentTypeIds) ?? []
        let defaultPaymentMethodId: String? = try container.decodeIfPresent(String.self, forKey: .defaultPaymentMethodId)
        let defaultPaymentTypeId: String? = try container.decodeIfPresent(String.self, forKey: .defaultPaymentTypeId)
        let defaultCardId: String? = try container.decodeIfPresent(String.self, forKey: .defaultCardId)

        self.init(maxAcceptedInstallments: maxAcceptedInstallments, defaultInstallments: defaultInstallments, excludedPaymentMethods: excludedPaymentMethods, excludedPaymentTypes: excludedPaymentTypes, defaultPaymentMethodId: defaultPaymentMethodId, defaultPaymentTypeId: defaultPaymentTypeId, defaultCardId: defaultCardId)
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: PXPaymentPreferenceKeys.self)
        try container.encodeIfPresent(self.defaultInstallments, forKey: .defaultInstallments)
        if maxAcceptedInstallments > 0 {
            try container.encode(maxAcceptedInstallments, forKey: .maxAcceptedInstallments)
        }
        try container.encodeIfPresent(getExclusionsFormatted(exclusions: self.excludedPaymentMethodIds), forKey: .excludedPaymentMethodIds)
        try container.encodeIfPresent(getExclusionsFormatted(exclusions: self.excludedPaymentTypeIds), forKey: .excludedPaymentTypeIds)
        try container.encodeIfPresent(self.defaultPaymentMethodId, forKey: .defaultPaymentMethodId)
        try container.encodeIfPresent(self.defaultPaymentTypeId, forKey: .defaultPaymentTypeId)
        try container.encodeIfPresent(self.cardId, forKey: .defaultCardId)
    }

    private func getExclusionsFormatted(exclusions: [String]) -> [PXExcludedPaymentMethod] {
        var formattedExlusions = [PXExcludedPaymentMethod]()
        for exclusionId in exclusions {
            formattedExlusions.append(PXExcludedPaymentMethod(id: exclusionId))
        }
        return formattedExlusions
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

    open class func fromJSON(data: Data) throws -> PXPaymentPreference {
        return try JSONDecoder().decode(PXPaymentPreference.self, from: data)
    }

}
