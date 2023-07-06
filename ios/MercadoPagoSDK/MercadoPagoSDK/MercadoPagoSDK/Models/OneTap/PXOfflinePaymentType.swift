//
//  PXOfflinePaymentType.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 18/12/2019.
//

import Foundation

public struct PXOfflinePaymentType: Codable {
    let id: String
    let name: PXText?
    let paymentMethods: [PXOfflinePaymentMethod]

    enum CodingKeys: String, CodingKey {
        case id
        case name
        case paymentMethods = "payment_methods"
    }

    public init(id: String, name: PXText?, paymentMethods: [PXOfflinePaymentMethod]) {
        self.id = id
        self.name = name
        self.paymentMethods = paymentMethods
    }
}
