//
//  PXBenefits.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 12/12/2019.
//

import Foundation

public struct PXBenefits: Codable {
    let installmentsHeader: PXText?
    let interestFree: PXInstallmentsConfiguration?
    let reimbursement: PXInstallmentsConfiguration?

    enum CodingKeys: String, CodingKey {
        case installmentsHeader = "installments_header"
        case interestFree = "interest_free"
        case reimbursement
    }
}
