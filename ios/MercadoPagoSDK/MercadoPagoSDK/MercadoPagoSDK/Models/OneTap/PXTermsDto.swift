//
//  PXTermsDto.swift
//  MercadoPagoSDKV4
//
//  Created by Federico Bustos Fierro on 25/06/2019.
//

import UIKit

/// :nodoc:
public struct PXTermsDto: Codable {
    let text: String
    let textColor: String?
    let linkablePhrases: [PXLinkablePhraseDto]?
    let links: [String: String]?

    enum CodingKeys: String, CodingKey {
        case text
        case textColor = "text_color"
        case linkablePhrases = "linkable_phrases"
        case links
    }
}
