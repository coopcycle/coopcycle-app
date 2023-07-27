//
//  PXPayerIconRenderer.swift
//  Pods
//
//  Created by Marcelo Oscar José on 17/10/2018.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import UIKit

class PXPayerIconRenderer: NSObject {

    let RADIUS_DELTA_FROM_ICON_TO_BACKGROUND: CGFloat = 58

    func render(component: PXPayerIconComponent) -> PXPayerIconView {
        let payerIconView = PXPayerIconView()
        payerIconView.translatesAutoresizingMaskIntoConstraints = false

        let background = UIView()
        background.translatesAutoresizingMaskIntoConstraints = false
        background.backgroundColor = ThemeManager.shared.iconBackgroundColor()
        payerIconView.payerIconBackground = background
        payerIconView.addSubview(payerIconView.payerIconBackground!)
        PXLayout.matchWidth(ofView: payerIconView.payerIconBackground!).isActive = true
        PXLayout.matchHeight(ofView: payerIconView.payerIconBackground!).isActive = true
        PXLayout.centerVertically(view: payerIconView.payerIconBackground!).isActive = true
        PXLayout.centerHorizontally(view: payerIconView.payerIconBackground!).isActive = true

        let payerIcon = UIImageView()
        payerIcon.translatesAutoresizingMaskIntoConstraints = false
        payerIcon.image = component.props.payerIcon
        payerIcon.contentMode = .scaleAspectFit
        payerIconView.payerIcon = payerIcon
        payerIconView.addSubview(payerIconView.payerIcon!)
        PXLayout.matchWidth(ofView: payerIconView.payerIcon!, toView: payerIconView.payerIconBackground, withPercentage: self.RADIUS_DELTA_FROM_ICON_TO_BACKGROUND).isActive = true
        PXLayout.matchHeight(ofView: payerIconView.payerIcon!, toView: payerIconView.payerIconBackground, withPercentage: self.RADIUS_DELTA_FROM_ICON_TO_BACKGROUND).isActive = true
        PXLayout.centerVertically(view: payerIconView.payerIcon!, to: payerIconView.payerIconBackground).isActive = true
        PXLayout.centerHorizontally(view: payerIconView.payerIcon!, to: payerIconView.payerIconBackground).isActive = true

        payerIconView.layer.masksToBounds = true

        return payerIconView
    }
}

class PXPayerIconView: UIView {
    var payerIcon: UIImageView?
    var payerIconBackground: UIView?
}
