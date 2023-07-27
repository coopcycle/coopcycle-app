//
//  PXCurrency+Business.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 26/07/2018.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

internal extension PXCurrency {

    func getCurrencySymbolOrDefault() -> String {
        return self.symbol ?? "$"
    }

    func getThousandsSeparatorOrDefault() -> String {
        return thousandSeparator ?? "."
    }

    func getDecimalPlacesOrDefault() -> Int {
        return decimalPlaces ?? 2
    }

    func getDecimalSeparatorOrDefault() -> String {
        return decimalSeparator ?? ","
    }
}
