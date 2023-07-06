//
//  PXPrimaryButton.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 9/4/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation
import MLUI

internal class PXPrimaryButton: MLButton {

    override init() {
        let config = MLButtonStylesFactory.config(for: .primaryAction)
        super.init(config: config)
    }

    required init(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
