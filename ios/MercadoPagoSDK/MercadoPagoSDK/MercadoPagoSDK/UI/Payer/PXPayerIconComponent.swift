//
//  PXPayerIconComponent.swift
//  MercadoPagoSDK
//
//  Created by Marcelo Oscar José on 17/10/2018.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import UIKit

internal class PXPayerIconComponent: PXComponentizable {
    var props: PXPayerIconProps

    init(props: PXPayerIconProps) {
        self.props = props
    }

    func render() -> UIView {
        return PXPayerIconRenderer().render(component: self)
    }
}

internal class PXPayerIconProps {
    var payerIcon: UIImage?

    init(payerIcon: UIImage?) {
        self.payerIcon = payerIcon
    }
}
