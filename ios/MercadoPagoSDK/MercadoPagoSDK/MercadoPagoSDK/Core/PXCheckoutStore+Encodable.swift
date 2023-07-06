//
//  PXCheckoutStore+Encodable.swift
//  MercadoPagoSDK
//
//  Created by Esteban Adrian Boffa on 26/06/2019.
//

import Foundation

extension PXCheckoutStore: Encodable {

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: PXCheckoutStoreCodingKeys.self)
        try container.encodeIfPresent(self.checkoutPreference?.id, forKey: .checkoutPreference)
        try container.encodeIfPresent(self.paymentDatas, forKey: .paymentDatas)
    }

    enum PXCheckoutStoreCodingKeys: String, CodingKey {
        case checkoutPreference = "pref_id"
        case paymentDatas = "payment_data"
    }
}
