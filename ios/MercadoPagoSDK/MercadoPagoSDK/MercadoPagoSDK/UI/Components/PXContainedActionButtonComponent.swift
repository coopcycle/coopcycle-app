//
//  PXContainedActionButtonComponent.swift
//  MercadoPagoSDK
//
//  Created by Demian Tejo on 23/1/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import UIKit

internal class PXContainedActionButtonComponent: PXComponentizable {
    weak var termsDelegate: PXTermsAndConditionViewDelegate?

    internal func render() -> UIView {
        return PXContainedActionButtonRenderer(termsDelegate: termsDelegate).render(self)
    }

    var props: PXContainedActionButtonProps

    init(props: PXContainedActionButtonProps, termsDelegate: PXTermsAndConditionViewDelegate?) {
        self.props = props
        self.termsDelegate = termsDelegate

    }
}

internal class PXContainedActionButtonProps {
    let title: String
    let action : (() -> Void)
    let backgroundColor: UIColor
    weak var animationDelegate: PXAnimatedButtonDelegate?
    let termsInfo: PXTermsDto?
    init(title: String, action:  @escaping (() -> Void), animationDelegate: PXAnimatedButtonDelegate? = nil, termsInfo: PXTermsDto? = nil) {
        self.title = title
        self.action = action
        self.backgroundColor = .white
        self.animationDelegate = animationDelegate
        self.termsInfo = termsInfo
    }
}
