//
//  PXTotalRowProps.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 23/5/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

final class PXTotalRowProps: NSObject {
    let title: NSAttributedString?
    let disclaimer: NSAttributedString?
    let mainValue: NSAttributedString?
    let secondaryValue: NSAttributedString?
    let showChevron: Bool

    init(title: NSAttributedString?, disclaimer: NSAttributedString?, mainValue: NSAttributedString?, secondaryValue: NSAttributedString?, showChevron: Bool = true) {
        self.title = title
        self.disclaimer = disclaimer
        self.mainValue = mainValue
        self.secondaryValue = secondaryValue
        self.showChevron = showChevron
    }
}
