//
//  PXPayerComponentRenderer.swift
//  MercadoPagoSDK
//
//  Created by Marcelo Oscar José on 14/10/2018.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import UIKit

class PXPayerComponentRenderer: NSObject {

    // Image
    let IMAGE_WIDTH: CGFloat = 48.0
    let IMAGE_HEIGHT: CGFloat = 48.0

    // Action Button
    let BUTTON_HEIGHT: CGFloat = 34.0

    let NAME_LABEL_SIZE: CGFloat = PXLayout.M_FONT
    let IDENTIFICATION_LABEL_SIZE: CGFloat = PXLayout.XS_FONT

    var payerView = PXPayerView()

    func render(component: PXPayerComponent) -> PXPayerView {
        payerView = PXPayerView()
        payerView.backgroundColor = component.props.backgroundColor
        payerView.translatesAutoresizingMaskIntoConstraints = false
        payerView.accessibilityIdentifier = "review_change_payer_data_row"
        addPayerIcon(component: component)
        addFullName(component: component)
        addIdentification(component: component)
        addSeparator(component: component)
        return payerView
    }

    func addPayerIcon(component: PXPayerComponent) {
        let payerIcon = component.getPayerIconComponent()
        payerView.payerIcon = payerIcon.render()
        payerView.payerIcon!.layer.cornerRadius = IMAGE_WIDTH / 2
        payerView.payerIcon!.layer.borderWidth = 2
        payerView.payerIcon!.layer.borderColor = ThemeManager.shared.lightTintColor().cgColor
        payerView.addSubview(payerView.payerIcon!)
        PXLayout.centerHorizontally(view: payerView.payerIcon!).isActive = true
        PXLayout.setHeight(owner: payerView.payerIcon!, height: IMAGE_HEIGHT).isActive = true
        PXLayout.setWidth(owner: payerView.payerIcon!, width: IMAGE_WIDTH).isActive = true
        PXLayout.pinTop(view: payerView.payerIcon!, withMargin: PXLayout.L_MARGIN).isActive = true
    }

    func addFullName(component: PXPayerComponent) {
        let fullName = UILabel()
        fullName.translatesAutoresizingMaskIntoConstraints = false
        payerView.fullNameLabel = fullName
        payerView.addSubview(fullName)
        fullName.font = Utils.getFont(size: NAME_LABEL_SIZE)
        fullName.attributedText = component.props.fulltName
        fullName.textColor = component.props.nameLabelColor
        fullName.textAlignment = .center
        fullName.numberOfLines = 0
        payerView.putOnBottomOfLastView(view: fullName, withMargin: PXLayout.S_MARGIN)?.isActive = true
        PXLayout.pinLeft(view: fullName, withMargin: PXLayout.S_MARGIN).isActive = true
        PXLayout.pinRight(view: fullName, withMargin: PXLayout.S_MARGIN).isActive = true
    }

    func addIdentification(component: PXPayerComponent) {
        let identification = UILabel()
        identification.translatesAutoresizingMaskIntoConstraints = false
        payerView.identificationLabel = identification
        payerView.addSubview(identification)
        identification.font = Utils.getFont(size: IDENTIFICATION_LABEL_SIZE)
        identification.attributedText = component.props.identityfication
        identification.textColor = component.props.identificationLabelColor
        identification.textAlignment = .center
        identification.numberOfLines = 0
        payerView.putOnBottomOfLastView(view: identification, withMargin: PXLayout.S_MARGIN)?.isActive = true
        PXLayout.pinLeft(view: identification, withMargin: PXLayout.S_MARGIN).isActive = true
        PXLayout.pinRight(view: identification, withMargin: PXLayout.S_MARGIN).isActive = true
    }

    func addSeparator(component: PXPayerComponent) {
        let separator = UIView()
        separator.translatesAutoresizingMaskIntoConstraints = false
        separator.backgroundColor = component.props.separatorColor
        payerView.separator = separator
        payerView.addSubview(separator)
        payerView.putOnBottomOfLastView(view: separator, withMargin: PXLayout.M_MARGIN)?.isActive = true
        PXLayout.setHeight(owner: payerView.separator!, height: 1).isActive = true
        PXLayout.pinLeft(view: separator, withMargin: PXLayout.ZERO_MARGIN).isActive = true
        PXLayout.pinRight(view: separator, withMargin: PXLayout.ZERO_MARGIN).isActive = true
        payerView.pinLastSubviewToBottom(withMargin: PXLayout.ZERO_MARGIN)?.isActive = true
    }
}
