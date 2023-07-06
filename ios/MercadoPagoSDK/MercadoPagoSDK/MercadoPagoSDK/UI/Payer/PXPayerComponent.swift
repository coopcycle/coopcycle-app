//
//  PXPayerComponent.swift
//  MercadoPagoSDK
//
//  Created by Marcelo Oscar José on 14/10/2018.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import UIKit

internal class PXPayerComponent: NSObject, PXComponentizable {
    var props: PXPayerProps

    init(props: PXPayerProps) {
        self.props = props
    }

    func render() -> UIView {
        return PXPayerComponentRenderer().render(component: self)
    }
}

// MARK: - Helper functions
internal extension PXPayerComponent {
    func getPayerIconComponent() -> PXPayerIconComponent {
        let payerIconProps = PXPayerIconProps(payerIcon: self.props.payerIcon)
        let payerIconComponent = PXPayerIconComponent(props: payerIconProps)
        return payerIconComponent
    }
}
