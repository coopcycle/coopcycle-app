//
//  PXOfflineMethods.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 18/12/2019.
//

import Foundation

public struct PXOfflineMethods: Codable {
    let label: PXText?
    let descriptionText: PXText?
    let paymentTypes: [PXOfflinePaymentType]

    enum CodingKeys: String, CodingKey {
        case label
        case descriptionText = "description"
        case paymentTypes = "payment_types"
    }
}
