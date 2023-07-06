//
//  PXCreditsDisplayInfo.swift
//  MercadoPagoSDKV4
//
//  Created by Federico Bustos Fierro on 25/06/2019.
//

import UIKit

/// :nodoc:
public struct PXCreditsDisplayInfo: Codable {
    let resultInfo: PXResultInfo
    let termsAndConditions: PXTermsDto?

    enum CodingKeys: String, CodingKey {
        case resultInfo = "result_info"
        case termsAndConditions = "terms_and_conditions"
    }
}
