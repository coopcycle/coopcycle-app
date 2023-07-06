//
//  PXPaymentMethodIconRenderer.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 12/21/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import UIKit

class PXPaymentMethodIconRenderer: NSObject {

    let RADIUS_DELTA_FROM_ICON_TO_BACKGROUND: CGFloat = 58

    func render(component: PXPaymentMethodIconComponent) -> PXPaymentMethodIconView {
        let pmIconView = PXPaymentMethodIconView()
        pmIconView.translatesAutoresizingMaskIntoConstraints = false
        let background = UIView()
        background.translatesAutoresizingMaskIntoConstraints = false
        background.backgroundColor = ThemeManager.shared.iconBackgroundColor()
        pmIconView.paymentMethodIconBackground = background
        pmIconView.addSubview(pmIconView.paymentMethodIconBackground!)
        PXLayout.matchWidth(ofView: pmIconView.paymentMethodIconBackground!).isActive = true
        PXLayout.matchHeight(ofView: pmIconView.paymentMethodIconBackground!).isActive = true
        PXLayout.centerVertically(view: pmIconView.paymentMethodIconBackground!).isActive = true
        PXLayout.centerHorizontally(view: pmIconView.paymentMethodIconBackground!).isActive = true

        let pmIcon = UIImageView()
        pmIcon.translatesAutoresizingMaskIntoConstraints = false
        pmIcon.image = component.props.paymentMethodIcon
        pmIconView.paymentMethodIcon = pmIcon
        pmIconView.addSubview(pmIconView.paymentMethodIcon!)
        PXLayout.matchWidth(ofView: pmIconView.paymentMethodIcon!, toView: pmIconView.paymentMethodIconBackground, withPercentage: self.RADIUS_DELTA_FROM_ICON_TO_BACKGROUND).isActive = true
        PXLayout.matchHeight(ofView: pmIconView.paymentMethodIcon!, toView: pmIconView.paymentMethodIconBackground, withPercentage: self.RADIUS_DELTA_FROM_ICON_TO_BACKGROUND).isActive = true
        PXLayout.centerVertically(view: pmIconView.paymentMethodIcon!, to: pmIconView.paymentMethodIconBackground).isActive = true
        PXLayout.centerHorizontally(view: pmIconView.paymentMethodIcon!, to: pmIconView.paymentMethodIconBackground).isActive = true

        pmIconView.layer.masksToBounds = true

        return pmIconView
    }
}

class PXPaymentMethodIconView: PXBodyView {
    var paymentMethodIcon: UIImageView?
    var paymentMethodIconBackground: UIView?
}
