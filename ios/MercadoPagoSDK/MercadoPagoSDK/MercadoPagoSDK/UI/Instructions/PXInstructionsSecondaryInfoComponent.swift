//
//  PXInstructionsSecondaryInfoComponent.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 11/15/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

internal class PXInstructionsSecondaryInfoComponent: PXComponentizable {
    var props: PXInstructionsSecondaryInfoProps

    init(props: PXInstructionsSecondaryInfoProps) {
        self.props = props
    }

    func render() -> UIView {
        return PXInstructionsSecondaryInfoRenderer().render(instructionsSecondaryInfo: self)
    }
}

internal class PXInstructionsSecondaryInfoProps {
    var secondaryInfo: [String]
    init(secondaryInfo: [String]) {
        self.secondaryInfo = secondaryInfo
    }
}
