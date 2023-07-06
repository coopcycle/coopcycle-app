//
//  PXPaymentMethod.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 10/20/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation
/// :nodoc:
@objcMembers
open class PXPaymentMethod: NSObject, Codable {
    open var additionalInfoNeeded: [String]?
    open var id: String!
    open var name: String?
    open var paymentTypeId: String = ""
    open var status: String?
    open var secureThumbnail: String?
    open var thumbnail: String?
    open var deferredCapture: String?
    open var settings: [PXSetting] = []
    open var minAllowedAmount: Double?
    open var maxAllowedAmount: Double?
    open var accreditationTime: Int?
    open var merchantAccountId: String?
    open var financialInstitutions: [PXFinancialInstitution]?
    open var externalPaymentPluginImageData: NSData?
    open var paymentMethodDescription: String?
    open var processingModes: [String]?
    open var creditsDisplayInfo: PXCreditsDisplayInfo?

    public init(additionalInfoNeeded: [String]?, id: String, name: String?, paymentTypeId: String, status: String?, secureThumbnail: String?, thumbnail: String?, deferredCapture: String?, settings: [PXSetting], minAllowedAmount: Double?, maxAllowedAmount: Double?, accreditationTime: Int?, merchantAccountId: String?, financialInstitutions: [PXFinancialInstitution]?, description: String?, processingModes: [String]?, creditsDisplayInfo: PXCreditsDisplayInfo? = nil) {
        self.additionalInfoNeeded = additionalInfoNeeded
        self.id = id
        self.name = name
        self.paymentTypeId = paymentTypeId
        self.status = status
        self.secureThumbnail = secureThumbnail
        self.thumbnail = thumbnail
        self.deferredCapture = deferredCapture
        self.settings = settings
        self.minAllowedAmount = minAllowedAmount
        self.maxAllowedAmount = maxAllowedAmount
        self.accreditationTime = accreditationTime
        self.merchantAccountId = merchantAccountId
        self.financialInstitutions = financialInstitutions
        self.paymentMethodDescription = description
        self.processingModes = processingModes
        self.creditsDisplayInfo = creditsDisplayInfo
    }

    public enum PXPaymentMethodKeys: String, CodingKey {
        case additionalInfoNeeded = "additional_info_needed"
        case id
        case name
        case paymentTypeId = "payment_type_id"
        case status
        case secureThumbnail = "secure_thumbnail"
        case thumbnail
        case deferredCapture = "deferred_capture"
        case settings
        case minAllowedAmount = "min_allowed_amount"
        case maxAllowedAmount = "max_allowed_amount"
        case accreditationTime = "accreditation_time"
        case merchantAccountId = "merchant_account_id"
        case financialInstitutions = "financial_institutions"
        case paymentMethodDescription = "description"
        case processingModes = "processing_modes"
        case creditsDisplayInfo = "display_info"
    }

    required public convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: PXPaymentMethodKeys.self)
        let additionalInfoNeeded: [String]? = try container.decodeIfPresent([String].self, forKey: .additionalInfoNeeded)
        let id: String = try container.decode(String.self, forKey: .id)
        let name: String? = try container.decodeIfPresent(String.self, forKey: .name)
        let paymentTypeId: String = try container.decodeIfPresent(String.self, forKey: .paymentTypeId) ?? ""
        let status: String? = try container.decodeIfPresent(String.self, forKey: .status)
        let secureThumbnail: String? = try container.decodeIfPresent(String.self, forKey: .secureThumbnail)
        let thumbnail: String? = try container.decodeIfPresent(String.self, forKey: .thumbnail)
        let deferredCapture: String? = try container.decodeIfPresent(String.self, forKey: .deferredCapture)
        let settings: [PXSetting] = try container.decodeIfPresent([PXSetting].self, forKey: .settings) ?? []
        let minAllowedAmount: Double? = try container.decodeIfPresent(Double.self, forKey: .minAllowedAmount)
        let maxAllowedAmount: Double? = try container.decodeIfPresent(Double.self, forKey: .maxAllowedAmount)
        let accreditationTime: Int? = try container.decodeIfPresent(Int.self, forKey: .accreditationTime)
        let merchantAccountId: String? = try container.decodeIfPresent(String.self, forKey: .merchantAccountId)
        let financialInstitutions: [PXFinancialInstitution]? = try container.decodeIfPresent([PXFinancialInstitution].self, forKey: .financialInstitutions)
        let description: String? = try container.decodeIfPresent(String.self, forKey: .paymentMethodDescription)
        let processingModes: [String]? = try container.decodeIfPresent([String].self, forKey: .processingModes)
        let creditsDisplayInfo: PXCreditsDisplayInfo? = try container.decodeIfPresent(PXCreditsDisplayInfo.self, forKey: .creditsDisplayInfo)

        self.init(additionalInfoNeeded: additionalInfoNeeded, id: id, name: name, paymentTypeId: paymentTypeId, status: status, secureThumbnail: secureThumbnail, thumbnail: thumbnail, deferredCapture: deferredCapture, settings: settings, minAllowedAmount: minAllowedAmount, maxAllowedAmount: maxAllowedAmount, accreditationTime: accreditationTime, merchantAccountId: merchantAccountId, financialInstitutions: financialInstitutions, description: description, processingModes: processingModes, creditsDisplayInfo: creditsDisplayInfo)
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: PXPaymentMethodKeys.self)
        try container.encodeIfPresent(self.additionalInfoNeeded, forKey: .additionalInfoNeeded)
        try container.encodeIfPresent(self.id, forKey: .id)
        try container.encodeIfPresent(self.name, forKey: .name)
        try container.encodeIfPresent(self.paymentTypeId, forKey: .paymentTypeId)
        try container.encodeIfPresent(self.status, forKey: .status)
        try container.encodeIfPresent(self.secureThumbnail, forKey: .secureThumbnail)
        try container.encodeIfPresent(self.thumbnail, forKey: .thumbnail)
        try container.encodeIfPresent(self.deferredCapture, forKey: .deferredCapture)
        try container.encodeIfPresent(self.settings, forKey: .settings)
        try container.encodeIfPresent(self.minAllowedAmount, forKey: .minAllowedAmount)
        try container.encodeIfPresent(self.maxAllowedAmount, forKey: .maxAllowedAmount)
        try container.encodeIfPresent(self.accreditationTime, forKey: .accreditationTime)
        try container.encodeIfPresent(self.merchantAccountId, forKey: .merchantAccountId)
        try container.encodeIfPresent(self.financialInstitutions, forKey: .financialInstitutions)
        try container.encodeIfPresent(self.processingModes, forKey: .processingModes)
        try container.encodeIfPresent(self.creditsDisplayInfo, forKey: .creditsDisplayInfo)
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

    open class func fromJSONToPXPaymentMethod(data: Data) throws -> PXPaymentMethod {
        return try JSONDecoder().decode(PXPaymentMethod.self, from: data)
    }

    open class func fromJSON(data: Data) throws -> [PXPaymentMethod] {
        return try JSONDecoder().decode([PXPaymentMethod].self, from: data)
    }
}

// MARK: Getters
extension PXPaymentMethod {
    /// :nodoc:
    @objc
    public func getId() -> String? {
        return id
    }
}
