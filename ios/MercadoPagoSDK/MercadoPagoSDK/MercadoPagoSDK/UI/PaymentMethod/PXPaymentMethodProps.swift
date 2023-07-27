//
//  PXPaymentMethodProps.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 16/5/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

final class PXPaymentMethodProps: NSObject {
    let paymentMethodIcon: UIImage?
    let title: NSAttributedString
    let subtitle: NSAttributedString?
    let descriptionTitle: NSAttributedString?
    let descriptionDetail: NSAttributedString?
    let disclaimer: NSAttributedString?
    let action: PXAction?
    let backgroundColor: UIColor
    let lightLabelColor: UIColor
    let boldLabelColor: UIColor

    public init(paymentMethodIcon: UIImage?, title: NSAttributedString, subtitle: NSAttributedString?, descriptionTitle: NSAttributedString?, descriptionDetail: NSAttributedString?, disclaimer: NSAttributedString?, action: PXAction? = nil, backgroundColor: UIColor, lightLabelColor: UIColor, boldLabelColor: UIColor) {
        self.paymentMethodIcon = paymentMethodIcon
        self.title = title
        self.subtitle = subtitle
        self.descriptionTitle = descriptionTitle
        self.descriptionDetail = descriptionDetail
        self.disclaimer = disclaimer
        self.action = action
        self.backgroundColor = backgroundColor
        self.lightLabelColor = lightLabelColor
        self.boldLabelColor = boldLabelColor
    }
}
