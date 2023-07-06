//
//  PXOneTapCreditsDto.swift
//  Bugsnag
//
//  Created by Federico Bustos Fierro on 24/06/2019.
//

import UIKit

/// :nodoc:
public struct PXOneTapCreditsDto: Codable {
    let displayInfo: PXDisplayInfoDto
    enum CodingKeys: String, CodingKey {
        case displayInfo = "display_info"
    }
}
