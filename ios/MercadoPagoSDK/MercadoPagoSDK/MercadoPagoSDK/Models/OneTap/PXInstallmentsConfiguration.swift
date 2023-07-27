//
//  PXInstallmentsConfiguration.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 12/12/2019.
//

import Foundation

public struct PXInstallmentsConfiguration: Codable {
    let appliedInstallments: [Int]
    let card: PXText?
    let installmentRow: PXText?

    enum CodingKeys: String, CodingKey {
        case appliedInstallments = "applied_installments"
        case card
        case installmentRow = "installment_row"
    }
}
