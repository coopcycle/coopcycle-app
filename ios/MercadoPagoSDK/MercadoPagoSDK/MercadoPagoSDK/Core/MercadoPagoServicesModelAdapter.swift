//
//  MercadoPagoServicesModelAdapter.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 10/25/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

internal extension MercadoPagoServicesAdapter {
    func getStringDateFromDate(_ date: Date) -> String {
        let stringDate = String(describing: date)
        return stringDate
    }
}
