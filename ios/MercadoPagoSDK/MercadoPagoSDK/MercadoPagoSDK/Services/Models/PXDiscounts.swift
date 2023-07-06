//
//  PXDiscounts.swift
//  MercadoPagoSDK
//
//  Created by Esteban Adrian Boffa on 28/08/2019.
//

import Foundation

struct PXDiscounts: Decodable {

    let title: String?
    let subtitle: String?
    let discountsAction: PXPointsAndDiscountsAction
    let downloadAction: PXDownloadAction
    let items: [PXDiscountsItem]

    enum CodingKeys: String, CodingKey {
        case title
        case subtitle
        case discountsAction = "action"
        case downloadAction = "action_download"
        case items
    }
}
