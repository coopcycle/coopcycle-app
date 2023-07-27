//
//  PXContainedLabelRenderer.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 1/23/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import UIKit

class PXContainedLabelRenderer: NSObject {

    func render(_ containedLabel: PXContainedLabelComponent) -> PXContainedLabelView {
        let containedLabelView = PXContainedLabelView()
        containedLabelView.translatesAutoresizingMaskIntoConstraints = false
        containedLabelView.backgroundColor = .white

        //Label
        containedLabelView.mainLabel = buildLabel(with: containedLabel.props.labelText)
        containedLabelView.addSubview(containedLabelView.mainLabel)
        PXLayout.centerVertically(view: containedLabelView.mainLabel).isActive = true
        PXLayout.centerHorizontally(view: containedLabelView.mainLabel).isActive = true
        PXLayout.matchWidth(ofView: containedLabelView.mainLabel).isActive = true
        PXLayout.matchHeight(ofView: containedLabelView.mainLabel).isActive = true
        return containedLabelView
    }

    func buildLabel(with text: NSAttributedString) -> UILabel {
        let label = UILabel()
        label.textAlignment = .center
        label.translatesAutoresizingMaskIntoConstraints = false
        label.attributedText = text
        label.textColor = ThemeManager.shared.boldLabelTintColor()
        label.lineBreakMode = .byWordWrapping
        label.numberOfLines = 0
        return label
    }
}

class PXContainedLabelView: PXComponentView {
    public var mainLabel: UILabel!
}
