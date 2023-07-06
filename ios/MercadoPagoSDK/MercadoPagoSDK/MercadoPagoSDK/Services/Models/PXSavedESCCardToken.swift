 //
//  PXSavedESCCardToken.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 10/20/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation
/// :nodoc:
open class PXSavedESCCardToken: PXSavedCardToken {
    open var esc: String?

    init (cardId: String, securityCode: String?, requireESC: Bool) {
        super.init(cardId: cardId)
        self.securityCode = securityCode
        self.cardId = cardId
        self.requireESC = requireESC
        self.device = PXDevice()
    }

    init (cardId: String, esc: String?, requireESC: Bool) {
        super.init(cardId: cardId)
        self.securityCode = ""
        self.cardId = cardId
        self.requireESC = requireESC
        self.esc = esc
        self.device = PXDevice()
    }

    public required init(from decoder: Decoder) throws {
        fatalError("init(from:) has not been implemented")
    }

    public enum PXSavedESCCardTokenKeys: String, CodingKey {
        case requireEsc = "require_esc"
        case esc
        case cardId = "card_id"
        case securityCode = "security_code"
        case device
    }

    public override func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: PXSavedESCCardTokenKeys.self)
        try container.encodeIfPresent(self.cardId, forKey: .cardId)
        try container.encodeIfPresent(self.securityCode, forKey: .securityCode)
        try container.encodeIfPresent(self.device, forKey: .device)
        try container.encodeIfPresent(self.esc, forKey: .esc)
        try container.encodeIfPresent(self.requireESC, forKey: .requireEsc)
    }

    open override func toJSONString() throws -> String? {
        let encoder = JSONEncoder()
        let data = try encoder.encode(self)
        return String(data: data, encoding: .utf8)
    }

    open override func toJSON() throws -> Data {
        let encoder = JSONEncoder()
        return try encoder.encode(self)
    }
}
