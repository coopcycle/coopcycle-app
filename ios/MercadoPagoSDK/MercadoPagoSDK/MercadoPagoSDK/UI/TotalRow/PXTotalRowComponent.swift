//
//  PXTotalRowComponent.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 23/5/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

class PXTotalRowComponent: PXComponentizable {
    var props: PXTotalRowProps

    init(props: PXTotalRowProps) {
        self.props = props
    }

    func render() -> UIView {
        return PXTotalRowRenderer().render(self)
    }
}
