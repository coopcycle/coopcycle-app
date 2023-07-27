//
//  PXBankDealComponent.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 23/4/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import UIKit

class PXBankDealComponent: PXComponentizable {

    public func render() -> UIView {
        return PXBankDealComponentRenderer().render(self)
    }

    var props: PXBankDealComponentProps

    init(props: PXBankDealComponentProps) {
        self.props = props
    }
}
