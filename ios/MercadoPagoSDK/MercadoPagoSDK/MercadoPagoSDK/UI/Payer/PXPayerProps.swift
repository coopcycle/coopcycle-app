//
//  PXPayerProps.swift
//  MercadoPagoSDK
//
//  Created by Marcelo Oscar José on 14/10/2018.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

final class PXPayerProps: NSObject {
    let payerIcon: UIImage?
    let identityfication: NSAttributedString
    let fulltName: NSAttributedString
    let backgroundColor: UIColor
    let nameLabelColor: UIColor
    let identificationLabelColor: UIColor
    let separatorColor: UIColor

    public init(payerIcon: UIImage?, identityfication: NSAttributedString, fulltName: NSAttributedString, backgroundColor: UIColor, nameLabelColor: UIColor, identificationLabelColor: UIColor, separatorColor: UIColor) {
        self.payerIcon = payerIcon
        self.identityfication = identityfication
        self.fulltName = fulltName
        self.backgroundColor = backgroundColor
        self.nameLabelColor = nameLabelColor
        self.identificationLabelColor = identificationLabelColor
        self.separatorColor = separatorColor
    }
}
