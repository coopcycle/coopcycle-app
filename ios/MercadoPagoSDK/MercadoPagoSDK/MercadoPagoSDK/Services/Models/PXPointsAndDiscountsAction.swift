//
//  PXPointsAndDiscountsAction.swift
//  MercadoPagoSDK
//
//  Created by Esteban Adrian Boffa on 28/08/2019.
//

import Foundation

struct PXPointsAndDiscountsAction: Decodable {

    let label: String
    let target: String

    enum CodingKeys: String, CodingKey {
        case label
        case target
    }
}
