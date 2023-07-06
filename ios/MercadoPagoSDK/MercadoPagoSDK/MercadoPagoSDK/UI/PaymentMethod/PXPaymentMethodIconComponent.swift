//
//  PXPaymentMethodIconComponent.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 12/21/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import UIKit

internal class PXPaymentMethodIconComponent: PXComponentizable {
    var props: PXPaymentMethodIconProps

    init(props: PXPaymentMethodIconProps) {
        self.props = props
    }
    func render() -> UIView {
        return PXPaymentMethodIconRenderer().render(component: self)
    }
}

internal class PXPaymentMethodIconProps {
    var paymentMethodIcon: UIImage?

    init(paymentMethodIcon: UIImage?) {
        self.paymentMethodIcon = paymentMethodIcon
    }
}
