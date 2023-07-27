//
//  SummaryRow.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 3/14/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

internal class SummaryRow {
    var customDescription: String
    var customAmount: Double
    var colorDescription: UIColor = UIColor.px_grayDark()
    var colorAmount: UIColor = UIColor.px_grayDark()
    var separatorLine: Bool = true
    var amountEnable = true

    init(customDescription: String, descriptionColor: UIColor?, customAmount: Double, amountColor: UIColor?, separatorLine: Bool = true) {
        self.customDescription = customDescription
        self.customAmount = customAmount
        self.separatorLine = separatorLine

        if let descriptionColor = descriptionColor {
            self.colorDescription = descriptionColor
        }
        if let amountColor = amountColor {
            self.colorAmount = amountColor
        }
    }

    func disableAmount() {
        amountEnable = false
    }

    func enableAmount() {
        amountEnable = true
    }

    func isAmountEnable() -> Bool {
        return amountEnable
    }
}
