//
//  SummaryItemDetail.swift
//  MercadoPagoSDK
//
//  Created by Demian Tejo on 9/6/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import UIKit

class SummaryItemDetail: NSObject {
    var name: String?
    var amount: Double
    init(name: String? = nil, amount: Double) {
        self.name = name
        self.amount = amount
    }
}
