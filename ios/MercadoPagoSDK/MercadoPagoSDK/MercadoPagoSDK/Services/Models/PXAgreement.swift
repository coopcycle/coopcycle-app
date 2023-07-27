//
//  PXAgreement.swift
//  MercadoPagoSDK
//
//  Created by Federico Bustos Fierro on 28/05/2019.
//

import UIKit

/**
 Support for gateway mode
 */

@objcMembers
open class PXAgreement: Codable {
    let merchantAccounts: [PXMerchantAccount]
    enum CodingKeys: String, CodingKey {
        case merchantAccounts = "merchant_accounts"
    }
}
