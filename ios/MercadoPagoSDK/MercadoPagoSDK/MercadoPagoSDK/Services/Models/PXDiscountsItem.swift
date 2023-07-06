//
//  PXDiscountsItem.swift
//  MercadoPagoSDK
//
//  Created by Esteban Adrian Boffa on 28/08/2019.
//

import Foundation

struct PXDiscountsItem: Decodable {

    let icon: String
    let title: String
    let subtitle: String
    let target: String?
    let campaingId: String?

    enum CodingKeys: String, CodingKey {
        case icon
        case title
        case subtitle
        case target
        case campaingId = "campaing_id"
    }
}
