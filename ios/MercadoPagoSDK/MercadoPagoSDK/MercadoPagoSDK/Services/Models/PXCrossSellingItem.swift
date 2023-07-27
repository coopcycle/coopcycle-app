//
//  PXCrossSellingItem.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 17/09/2019.
//

import Foundation

struct PXCrossSellingItem: Decodable {

    let title: String
    let icon: String
    let contentId: String
    let action: PXPointsAndDiscountsAction

    enum CodingKeys: String, CodingKey {
        case title
        case icon
        case contentId = "content_id"
        case action
    }
}
