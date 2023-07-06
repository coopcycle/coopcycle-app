//
//  PXPointsProgress.swift
//  MercadoPagoSDK
//
//  Created by Esteban Adrian Boffa on 28/08/2019.
//

import Foundation

struct PXPointsProgress: Decodable {

    let percentage: Double
    let levelColor: String
    let levelNumber: Int

    enum CodingKeys: String, CodingKey {
        case percentage
        case levelColor = "level_color"
        case levelNumber = "level_number"
    }
}
