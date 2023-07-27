//
//  PXLinkablePhraseDto.swift
//  MercadoPagoSDKV4
//
//  Created by Federico Bustos Fierro on 25/06/2019.
//

import UIKit

struct PXLinkablePhraseDto: Codable {
    let textColor: String
    let phrase: String
    let link: String?
    let html: String?
    let installments: [String: String]?

    enum CodingKeys: String, CodingKey {
        case textColor = "text_color"
        case phrase
        case link
        case html
        case installments
    }
}
