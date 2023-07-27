//
//  PXFooterProps.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 16/5/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

final class PXFooterProps: NSObject {
    var buttonAction: PXAction?
    var linkAction: PXAction?
    var primaryColor: UIColor?
    weak var animationDelegate: PXAnimatedButtonDelegate?
    var pinLastSubviewToBottom: Bool
    var termsInfo: PXTermsDto?
    init(buttonAction: PXAction? = nil, linkAction: PXAction? = nil, primaryColor: UIColor? = ThemeManager.shared.getAccentColor(), animationDelegate: PXAnimatedButtonDelegate? = nil, pinLastSubviewToBottom: Bool = true, termsInfo: PXTermsDto? = nil) {
        self.buttonAction = buttonAction
        self.linkAction = linkAction
        self.primaryColor = primaryColor
        self.animationDelegate = animationDelegate
        self.pinLastSubviewToBottom = pinLastSubviewToBottom
        self.termsInfo = termsInfo
    }
}
