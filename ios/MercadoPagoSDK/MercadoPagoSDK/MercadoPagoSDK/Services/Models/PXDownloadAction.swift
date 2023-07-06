//
//  PXDownloadAction.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 19/09/2019.
//

import Foundation

struct PXDownloadAction: Decodable {
    let title: String
    let action: PXPointsAndDiscountsAction
}
