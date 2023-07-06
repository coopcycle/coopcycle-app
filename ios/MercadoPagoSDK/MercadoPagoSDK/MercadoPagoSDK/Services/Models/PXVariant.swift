//
//  PXVariant.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 31/10/2019.
//

import Foundation

struct PXVariant: Decodable {
    let id: Int
    let name: String
    let availableFeatures: [PXAvailableFeatures]

    enum CodingKeys: String, CodingKey {
        case id
        case name
        case availableFeatures = "available_features"
    }
}
