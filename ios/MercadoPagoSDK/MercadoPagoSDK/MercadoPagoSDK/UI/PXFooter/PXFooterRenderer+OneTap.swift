//
//  PXFooterRenderer+OneTap.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 16/5/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

extension PXFooterRenderer {
    func oneTapRender(_ footer: PXFooterComponent) -> UIView {
        let fooView = PXFooterAnimatedView()
        fooView.translatesAutoresizingMaskIntoConstraints = false
        fooView.backgroundColor = .clear
        if let principalAction = footer.props.buttonAction {
            let animatedButton = self.buildAnimatedButton(with: principalAction, color: footer.props.primaryColor)
            fooView.animatedButton = animatedButton
            fooView.addSubview(animatedButton)
            PXLayout.pinTop(view: animatedButton, withMargin: PXLayout.M_MARGIN).isActive = true
            PXLayout.pinLeft(view: animatedButton, withMargin: PXLayout.M_MARGIN).isActive = true
            PXLayout.pinRight(view: animatedButton, withMargin: PXLayout.M_MARGIN).isActive = true
            PXLayout.setHeight(owner: fooView, height: BUTTON_HEIGHT + PXLayout.XXL_MARGIN).isActive = true
            PXLayout.setHeight(owner: animatedButton, height: BUTTON_HEIGHT).isActive = true
        }
        return fooView
    }
}
