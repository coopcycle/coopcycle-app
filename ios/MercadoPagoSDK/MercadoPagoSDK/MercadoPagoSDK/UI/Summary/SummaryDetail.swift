//
//  SummaryDetail.swift
//  MercadoPagoSDK
//
//  Created by Demian Tejo on 9/6/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import UIKit

class SummaryDetail: NSObject {

    var title: String
    var details: [SummaryItemDetail]
    var titleColor = ThemeManager.shared.boldLabelTintColor()
    var amountColor = ThemeManager.shared.boldLabelTintColor()
    func getTotalAmount() -> Double {
        var sum: Double = 0
        for detail in details {
            sum += detail.amount
        }
        return sum
    }
    init(title: String, detail: SummaryItemDetail?) {
        self.title = title
        self.details = [SummaryItemDetail]()
        if let detail = detail {
            self.details.append(detail)
        }
    }
    func addDetail(summaryItemDetail: SummaryItemDetail) {
        self.details.append(summaryItemDetail)
    }
}
