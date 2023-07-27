//
//  PXResultInfo.swift
//  MercadoPagoSDKV4
//
//  Created by Federico Bustos Fierro on 25/06/2019.
//

import UIKit

struct PXResultInfo: Codable {
    let title: String
    let subtitle: String

    enum CodingKeys: String, CodingKey {
        case title
        case subtitle
    }
}
