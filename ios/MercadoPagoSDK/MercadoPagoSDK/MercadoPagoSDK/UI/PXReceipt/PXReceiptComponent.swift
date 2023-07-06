//
//  PXReceiptComponent.swift
//  MercadoPagoSDK
//
//  Created by Demian Tejo on 4/12/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import UIKit

internal class PXReceiptComponent: PXComponentizable {
    var props: PXReceiptProps

    init(props: PXReceiptProps) {
        self.props = props
    }
    func render() -> UIView {
        return PXReceiptRenderer().render(self)
    }
}

class PXReceiptProps {
    var dateLabelString: String?
    var receiptDescriptionString: String?
    init(dateLabelString: String? = nil, receiptDescriptionString: String? = nil) {
        self.dateLabelString = dateLabelString
        self.receiptDescriptionString = receiptDescriptionString
    }
}
