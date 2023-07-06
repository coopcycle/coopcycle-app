//
//  PXOutlinedSecondaryButton.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 17/09/2019.
//

import Foundation
import MLUI

internal class PXOutlinedSecondaryButton: MLButton {

    override init() {
        let config = MLButtonStylesFactory.config(for: .secondaryAction)
        super.init(config: config)
    }

    required init(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
