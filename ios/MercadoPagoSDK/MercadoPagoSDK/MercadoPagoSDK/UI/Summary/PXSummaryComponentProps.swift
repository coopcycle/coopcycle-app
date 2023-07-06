//
//  PXSummaryComponentProps.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 1/3/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

final class PXSummaryComponentProps: NSObject {

    let width: CGFloat
    let summaryViewModel: Summary
    let amountHelper: PXAmountHelper
    let customTitle: String
    let textColor: UIColor
    let backgroundColor: UIColor

    init(summaryViewModel: Summary, amountHelper: PXAmountHelper, width: CGFloat, customTitle: String, textColor: UIColor, backgroundColor: UIColor) {
        self.width = width
        self.summaryViewModel = summaryViewModel
        self.amountHelper = amountHelper
        self.customTitle = customTitle
        self.textColor = textColor
        self.backgroundColor = backgroundColor
    }
}
