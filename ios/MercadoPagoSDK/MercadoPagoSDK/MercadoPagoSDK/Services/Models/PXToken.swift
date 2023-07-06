//
//  PXToken.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 10/20/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation
/// :nodoc:
@objcMembers
open class PXToken: NSObject, Codable {
    open var id: String!
    open var publicKey: String?
    open var cardId: String = ""
    open var luhnValidation: Bool?
    open var status: String?
    open var usedDate: Date?
    open var cardNumberLength: Int = 0
    open var dateCreated: Date?
    open var securityCodeLength: Int = 0
    open var expirationMonth: Int = 0
    open var expirationYear: Int = 0
    open var dateLastUpdated: Date?
    open var dueDate: Date?
    open var firstSixDigits: String = ""
    open var lastFourDigits: String = ""
    open var cardholder: PXCardHolder?
    open var esc: String?

    public init(id: String, publicKey: String?, cardId: String, luhnValidation: Bool?, status: String?, usedDate: Date?, cardNumberLength: Int, dateCreated: Date?, securityCodeLength: Int, expirationMonth: Int, expirationYear: Int, dateLastUpdated: Date?, dueDate: Date?, firstSixDigits: String, lastFourDigits: String, cardholder: PXCardHolder?, esc: String?) {

        self.id = id
        self.publicKey = publicKey
        self.cardId = cardId
        self.luhnValidation = luhnValidation
        self.status = status
        self.usedDate = usedDate
        self.cardNumberLength = cardNumberLength
        self.dateCreated = dateCreated
        self.securityCodeLength = securityCodeLength
        self.expirationMonth = expirationMonth
        self.expirationYear = expirationYear
        self.dateLastUpdated = dateLastUpdated
        self.dueDate = dueDate
        self.firstSixDigits = firstSixDigits
        self.lastFourDigits = lastFourDigits
        self.cardholder = cardholder
        self.esc = esc
    }

    public enum PXTokenKeys: String, CodingKey {
        case id
        case publicKey = "public_key"
        case cardId = "card_id"
        case luhnValidation = "luhn_validation"
        case status
        case usedDate = "used_date"
        case cardNumberLength = "card_number_length"
        case dateCreated = "date_created"
        case securityCodeLength = "security_code_length"
        case expirationMonth = "expiration_month"
        case expirationYear = "expiration_year"
        case dateLastUpdated = "date_last_updated"
        case dueDate = "date_due"
        case firstSixDigits = "first_six_digits"
        case lastFourDigits = "last_four_digits"
        case cardholder
        case esc
    }

    required public convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: PXTokenKeys.self)
        let id: String = try container.decode(String.self, forKey: .id)
        let publicKey: String? = try container.decodeIfPresent(String.self, forKey: .publicKey)
        let cardId: String = try container.decodeIfPresent(String.self, forKey: .cardId) ?? ""
        let luhnValidation: Bool? = try container.decodeIfPresent(Bool.self, forKey: .luhnValidation)
        let status: String? = try container.decodeIfPresent(String.self, forKey: .status)
        let usedDate: Date? = try container.decodeDateFromStringIfPresent(forKey: .usedDate)
        let cardNumberLength: Int = try container.decodeIfPresent(Int.self, forKey: .cardNumberLength) ?? 0
        let dateCreated: Date? = try container.decodeDateFromStringIfPresent(forKey: .dateCreated)
        let securityCodeLength: Int = try container.decodeIfPresent(Int.self, forKey: .securityCodeLength) ?? 0
        let expirationMonth: Int = try container.decodeIfPresent(Int.self, forKey: .expirationMonth) ?? 0
        let expirationYear: Int = try container.decodeIfPresent(Int.self, forKey: .expirationYear) ?? 0
        let dateLastUpdated: Date? = try container.decodeDateFromStringIfPresent(forKey: .dateLastUpdated)
        let dueDate: Date? = try container.decodeDateFromStringIfPresent(forKey: .dueDate)
        let firstSixDigits: String = try container.decodeIfPresent(String.self, forKey: .firstSixDigits) ?? ""
        let lastFourDigits: String = try container.decodeIfPresent(String.self, forKey: .lastFourDigits) ?? ""
        let cardholder: PXCardHolder? = try container.decodeIfPresent(PXCardHolder.self, forKey: .cardholder)
        let esc: String? = try container.decodeIfPresent(String.self, forKey: .esc)

        self.init(id: id, publicKey: publicKey, cardId: cardId, luhnValidation: luhnValidation, status: status, usedDate: usedDate, cardNumberLength: cardNumberLength, dateCreated: dateCreated, securityCodeLength: securityCodeLength, expirationMonth: expirationMonth, expirationYear: expirationYear, dateLastUpdated: dateLastUpdated, dueDate: dueDate, firstSixDigits: firstSixDigits, lastFourDigits: lastFourDigits, cardholder: cardholder, esc: esc)
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: PXTokenKeys.self)
        try container.encodeIfPresent(self.id, forKey: .id)
        try container.encodeIfPresent(self.publicKey, forKey: .publicKey)
        try container.encodeIfPresent(self.cardId, forKey: .cardId)
        try container.encodeIfPresent(self.luhnValidation, forKey: .luhnValidation)
        try container.encodeIfPresent(self.status, forKey: .status)
        try container.encodeIfPresent(self.usedDate, forKey: .usedDate)
        try container.encodeIfPresent(self.cardNumberLength, forKey: .cardNumberLength)
        try container.encodeIfPresent(self.dateCreated, forKey: .dateCreated)
        try container.encodeIfPresent(self.securityCodeLength, forKey: .securityCodeLength)
        try container.encodeIfPresent(self.expirationMonth, forKey: .expirationMonth)
        try container.encodeIfPresent(self.expirationYear, forKey: .expirationYear)
        try container.encodeIfPresent(self.dateLastUpdated, forKey: .dateLastUpdated)
        try container.encodeIfPresent(self.dueDate, forKey: .dueDate)
        try container.encodeIfPresent(self.firstSixDigits, forKey: .firstSixDigits)
        try container.encodeIfPresent(self.lastFourDigits, forKey: .lastFourDigits)
        try container.encodeIfPresent(self.cardholder, forKey: .cardholder)
        try container.encodeIfPresent(self.esc, forKey: .esc)
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

    open class func fromJSON(data: Data) throws -> PXToken {
        return try JSONDecoder().decode(PXToken.self, from: data)
    }
}

// MARK: Getters
extension PXToken {
    /// :nodoc:
    @objc
    public func getId() -> String? {
        return id
    }
}
