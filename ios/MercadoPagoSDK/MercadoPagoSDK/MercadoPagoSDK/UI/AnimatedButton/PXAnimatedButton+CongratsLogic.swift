//
//  PXAnimatedButton+CongratsLogic.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 03/07/2018.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

extension PXAnimatedButton {
    static func animateButtonWith(status: String, statusDetail: String? = nil) {
        PXNotificationManager.Post.animateButton(with: PXAnimatedButtonNotificationObject(status: status, statusDetail: statusDetail))
    }
}
