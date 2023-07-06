//
//  PXCardToken.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 10/20/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation
/// :nodoc:
open class PXCardToken: NSObject, Encodable {
    open var cardholder: PXCardHolder?
    open var cardNumber: String?
    open var device: PXDevice = PXDevice()
    open var expirationMonth: Int = 0
    open var expirationYear: Int = 0
    open var securityCode: String?
    open var requireESC: Bool = false

    // For validations
    let MIN_LENGTH_NUMBER: Int = 10
    let MAX_LENGTH_NUMBER: Int = 19
    let now = (Calendar.current as NSCalendar).components([.year, .month], from: Date())

    internal init (cardNumber: String?, expirationMonth: Int, expirationYear: Int, securityCode: String?, cardholderName: String, docType: String, docNumber: String, requireESC: Bool = false) {
        super.init()
        self.cardholder = PXCardHolder(name: cardholderName, identification: PXIdentification(number: docNumber, type: docType))
        self.cardholder?.name = cardholderName
        self.cardNumber = normalizeCardNumber(cardNumber?.replacingOccurrences(of: " ", with: ""))
        self.expirationMonth = expirationMonth
        self.expirationYear = 2000 + expirationYear
        self.securityCode = securityCode
        self.requireESC = requireESC
    }

    override init() {

    }

    // Set if esc is enabled
    internal func setRequireESC(escEnabled: Bool) {
        requireESC = escEnabled
    }

    public enum PXCardTokenKeys: String, CodingKey {
        case cardholder
        case cardNumber = "card_number"
        case device
        case expirationMonth = "expiration_month"
        case expirationYear = "expiration_year"
        case securityCode = "security_code"
        case requireEsc = "require_esc"
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: PXCardTokenKeys.self)
        try container.encodeIfPresent(self.cardholder, forKey: .cardholder)
        try container.encodeIfPresent(self.cardNumber, forKey: .cardNumber)
        try container.encodeIfPresent(self.device, forKey: .device)
        try container.encodeIfPresent(self.expirationMonth, forKey: .expirationMonth)
        try container.encodeIfPresent(self.expirationYear, forKey: .expirationYear)
        try container.encodeIfPresent(self.securityCode, forKey: .securityCode)
        try container.encodeIfPresent(self.requireESC, forKey: .requireEsc)

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
