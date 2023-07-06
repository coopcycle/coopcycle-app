//
//  PXBankDealComponentRenderer.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 23/4/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import UIKit

class PXBankDealComponentRenderer: NSObject {

    let IMAGE_VIEW_HEIGHT: CGFloat = 40

    func render(_ component: PXBankDealComponent) -> PXBankDealComponentView {
        let bankDealComponentView = PXBankDealComponentView()
        bankDealComponentView.translatesAutoresizingMaskIntoConstraints = false
        bankDealComponentView.backgroundColor = .white

        //Image View
        let image = PXUIImage(url: component.props.imageUrl, placeholder: component.props.placeholder, fallback: component.props.placeholder)
        let imageView = PXUIImageView(image: image)
        imageView.translatesAutoresizingMaskIntoConstraints = false
        bankDealComponentView.imageView = imageView
        bankDealComponentView.addSubview(imageView)
        PXLayout.pinTop(view: imageView, withMargin: PXLayout.XS_MARGIN).isActive = true
        PXLayout.centerHorizontally(view: imageView).isActive = true
        PXLayout.setHeight(owner: imageView, height: IMAGE_VIEW_HEIGHT).isActive = true
        PXLayout.pinLeft(view: imageView).isActive = true
        PXLayout.pinRight(view: imageView).isActive = true

        //Title Label
        let title = component.props.title
        let titleLabel = UILabel()
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        bankDealComponentView.titleLabel = titleLabel
        titleLabel.font = Utils.getFont(size: PXLayout.XS_FONT)
        titleLabel.text = title
        titleLabel.numberOfLines = 2
        titleLabel.textAlignment = .center
        titleLabel.textColor = ThemeManager.shared.boldLabelTintColor()
        bankDealComponentView.addSubviewToBottom(titleLabel, withMargin: PXLayout.XS_MARGIN)
        PXLayout.matchWidth(ofView: titleLabel).isActive = true
        PXLayout.centerHorizontally(view: titleLabel).isActive = true

        //Subtitle Label
        if let subtitle = component.props.subtitle {
            let subtitleLabel = UILabel()
            subtitleLabel.translatesAutoresizingMaskIntoConstraints = false
            bankDealComponentView.subtitleLabel = subtitleLabel
            subtitleLabel.font = Utils.getFont(size: PXLayout.XXS_FONT)
            subtitleLabel.text = subtitle
            subtitleLabel.textColor = ThemeManager.shared.labelTintColor()
            bankDealComponentView.addSubview(subtitleLabel)
            PXLayout.put(view: subtitleLabel, onBottomOf: titleLabel, withMargin: PXLayout.XXXS_MARGIN).isActive = true
            PXLayout.centerHorizontally(view: subtitleLabel).isActive = true
        }

        PXLayout.pinLastSubviewToBottom(view: bankDealComponentView, withMargin: PXLayout.XS_MARGIN)?.isActive = true
        return bankDealComponentView
    }
}
