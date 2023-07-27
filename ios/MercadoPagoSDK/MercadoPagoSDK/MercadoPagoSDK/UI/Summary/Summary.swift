//
//  Summary.swift
//  MercadoPagoSDK
//
//  Created by Demian Tejo on 9/6/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import UIKit

class Summary: NSObject {

    var details: [SummaryType: SummaryDetail]
    var disclaimer: String?
    var disclaimerColor: UIColor = UIColor.UIColorFromRGB(0x3bc280)
    var showSubtitle: Bool = false

    init(details: [SummaryType: SummaryDetail]) {
        self.details = details
    }

    func updateTitle(type: SummaryType, oneWordTitle: String) {
        guard let summaryDetail = self.details[type] else {
            return
        }
        summaryDetail.title = oneWordTitle
    }

    func addSummaryDetail(summaryDetail: SummaryDetail, type: SummaryType) {
        if self.details[type] == nil {
            self.details[type] = summaryDetail
        }
    }
    func addAmountDetail(detail: SummaryItemDetail, type: SummaryType) {
        guard let summaryDetail = self.details[type] else {
            return
        }
        summaryDetail.details.append(detail)
    }
}
