//
//  PXPoints.swift
//  MercadoPagoSDK
//
//  Created by Esteban Adrian Boffa on 28/08/2019.
//

import Foundation

struct PXPoints: Decodable {

    let progress: PXPointsProgress
    let title: String
    let action: PXPointsAndDiscountsAction

    enum CodingKeys: String, CodingKey {
        case progress
        case title
        case action
    }
}

