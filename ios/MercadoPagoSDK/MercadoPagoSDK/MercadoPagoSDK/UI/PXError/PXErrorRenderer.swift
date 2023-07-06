//
//  PXErrorRenderer.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 12/4/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import UIKit

class PXErrorRenderer: NSObject {

    let CONTENT_WIDTH_PERCENT: CGFloat = 84.0
    let TITLE_FONT_SIZE: CGFloat = PXLayout.M_FONT
    let DESCRIPTION_FONT_SIZE: CGFloat = PXLayout.XS_FONT
    let ACTION_FONT_SIZE: CGFloat = PXLayout.S_FONT
    let ACTION_LABEL_FONT_COLOR: UIColor = ThemeManager.shared.secondaryColor()

    func render(component: PXErrorComponent) -> PXErrorView {
        let errorBodyView = PXErrorView()
        errorBodyView.backgroundColor = .white
        errorBodyView.translatesAutoresizingMaskIntoConstraints = false

        //Title Label
        if let title = component.props.title, title.string.isNotEmpty {
            errorBodyView.titleLabel = buildTitleLabel(with: title, in: errorBodyView)
        }

        //Message Label
        if let message = component.props.message, message.string.isNotEmpty {
            errorBodyView.descriptionLabel = buildDescriptionLabel(with: message, in: errorBodyView, onBottomOf: errorBodyView.titleLabel)
        }

        //Action Button
        if let action = component.props.action {
            errorBodyView.actionButton = buildActionButton(with: action, in: errorBodyView, onBottomOf: errorBodyView.descriptionLabel)
        }

        //Secondary Title
        if let secondaryTitle = component.props.secondaryTitle {
            errorBodyView.middleDivider = buildMiddleDivider(in: errorBodyView, onBottomOf: errorBodyView.actionButton)
            errorBodyView.secondaryTitleLabel = buildSecondaryTitleLabel(with: secondaryTitle, in: errorBodyView, onBottomOf: errorBodyView.middleDivider)
            errorBodyView.bottomDivider = buildBottomDivider(in: errorBodyView, onBottomOf: errorBodyView.secondaryTitleLabel)
            errorBodyView.pinLastSubviewToBottom(withMargin: PXLayout.ZERO_MARGIN)?.isActive = true
        } else {
            errorBodyView.pinLastSubviewToBottom(withMargin: PXLayout.L_MARGIN)?.isActive = true
        }

        return errorBodyView
    }

    func buildTitleLabel(with text: NSAttributedString, in superView: UIView) -> UILabel {
        let label = UILabel()
        let font = UIFont.ml_semiboldSystemFont(ofSize: TITLE_FONT_SIZE) ?? Utils.getSemiBoldFont(size: TITLE_FONT_SIZE)
        label.translatesAutoresizingMaskIntoConstraints = false
        label.textAlignment = .left
        label.textColor = UIColor.black.withAlphaComponent(0.8)
        label.numberOfLines = 0
        label.attributedText = text
        label.font = font
        label.lineBreakMode = .byWordWrapping
        superView.addSubview(label)

        let screenWidth = PXLayout.getScreenWidth(applyingMarginFactor: CONTENT_WIDTH_PERCENT)

        let height = UILabel.requiredHeight(forAttributedText: text, withFont: font, inWidth: screenWidth)
        PXLayout.setHeight(owner: label, height: height).isActive = true
        PXLayout.matchWidth(ofView: label, toView: superView, withPercentage: CONTENT_WIDTH_PERCENT).isActive = true
        PXLayout.centerHorizontally(view: label, to: superView).isActive = true
        PXLayout.pinTop(view: label, withMargin: PXLayout.L_MARGIN).isActive = true
        return label
    }

    func buildDescriptionLabel(with text: NSAttributedString, in superView: UIView, onBottomOf upperView: UIView?) -> UILabel {
        let label = UILabel()
        let font = UIFont.ml_regularSystemFont(ofSize: DESCRIPTION_FONT_SIZE) ?? Utils.getFont(size: DESCRIPTION_FONT_SIZE)
        label.translatesAutoresizingMaskIntoConstraints = false
        label.textAlignment = .left
        label.textColor = UIColor.black.withAlphaComponent(0.45)
        label.numberOfLines = 0
        label.attributedText = text
        label.font = font
        label.lineBreakMode = .byWordWrapping
        superView.addSubview(label)

        let screenWidth = PXLayout.getScreenWidth(applyingMarginFactor: CONTENT_WIDTH_PERCENT)

        PXLayout.matchWidth(ofView: label, toView: superView, withPercentage: CONTENT_WIDTH_PERCENT).isActive = true
        PXLayout.centerHorizontally(view: label, to: superView).isActive = true
        if let upperView = upperView {
            PXLayout.put(view: label, onBottomOf: upperView, withMargin: PXLayout.S_MARGIN).isActive = true
        } else {
            PXLayout.pinTop(view: label, withMargin: PXLayout.L_MARGIN).isActive = true
        }
        return label
    }

    func buildActionButton(with action: PXAction, in superView: UIView, onBottomOf upperView: UIView?) -> UIButton {
        let title = action.label
        let button = UIButton()
        button.translatesAutoresizingMaskIntoConstraints = false
        button.setTitle(title, for: .normal)
        button.titleLabel?.font = Utils.getFont(size: ACTION_FONT_SIZE)
        button.setTitleColor(ACTION_LABEL_FONT_COLOR, for: .normal)
        button.titleLabel?.numberOfLines = 0
        button.titleLabel?.textAlignment = .left
        button.add(for: .touchUpInside) {
            action.action()
        }
        superView.addSubview(button)

        let screenWidth = PXLayout.getScreenWidth(applyingMarginFactor: CONTENT_WIDTH_PERCENT)

        let height = UILabel.requiredHeight(forText: title, withFont: Utils.getFont(size: ACTION_FONT_SIZE), inNumberOfLines: 0, inWidth: screenWidth)
        PXLayout.setHeight(owner: button, height: height).isActive = true
        PXLayout.matchWidth(ofView: button, toView: superView, withPercentage: CONTENT_WIDTH_PERCENT).isActive = true
        PXLayout.centerHorizontally(view: button, to: superView).isActive = true

        if let upperView = upperView {
            PXLayout.put(view: button, onBottomOf: upperView, withMargin: PXLayout.M_MARGIN).isActive = true
        }
        return button
    }

    func buildSecondaryTitleLabel(with text: NSAttributedString, in superView: UIView, onBottomOf upperView: UIView?) -> UILabel {
        let label = UILabel()
        let font = UIFont.ml_semiboldSystemFont(ofSize: TITLE_FONT_SIZE) ?? Utils.getSemiBoldFont(size: TITLE_FONT_SIZE)
        label.translatesAutoresizingMaskIntoConstraints = false
        label.textAlignment = .left
        label.textColor = UIColor.black.withAlphaComponent(0.8)
        label.numberOfLines = 0
        label.attributedText = text
        label.font = font
        label.lineBreakMode = .byWordWrapping
        superView.addSubview(label)

        let screenWidth = PXLayout.getScreenWidth(applyingMarginFactor: CONTENT_WIDTH_PERCENT)

        let height = UILabel.requiredHeight(forAttributedText: text, withFont: font, inWidth: screenWidth)
        PXLayout.setHeight(owner: label, height: height).isActive = true
        PXLayout.matchWidth(ofView: label, toView: superView, withPercentage: CONTENT_WIDTH_PERCENT).isActive = true
        PXLayout.centerHorizontally(view: label, to: superView).isActive = true
        if let upperView = upperView {
            PXLayout.put(view: label, onBottomOf: upperView, withMargin: PXLayout.L_MARGIN).isActive = true
        }
        return label
    }

    func buildMiddleDivider(in superView: UIView, onBottomOf upperView: UIView?) -> UIView {
        let view = UIView()
        view.translatesAutoresizingMaskIntoConstraints = false
        view.backgroundColor = .pxMediumLightGray
        superView.addSubview(view)
        PXLayout.setHeight(owner: view, height: 1).isActive = true
        PXLayout.matchWidth(ofView: view, toView: superView).isActive = true
        PXLayout.centerHorizontally(view: view, to: superView).isActive = true

        if let upperView = upperView {
            PXLayout.put(view: view, onBottomOf: upperView, withMargin: PXLayout.XXL_MARGIN).isActive = true
        }
        return view
    }

    func buildBottomDivider(in superView: UIView, onBottomOf upperView: UIView?) -> UIView {
        let view = UIView()
        view.translatesAutoresizingMaskIntoConstraints = false
        view.backgroundColor = .pxMediumLightGray
        superView.addSubview(view)
        PXLayout.setHeight(owner: view, height: 1).isActive = true
        PXLayout.matchWidth(ofView: view, toView: superView).isActive = true
        PXLayout.centerHorizontally(view: view, to: superView).isActive = true

        if let upperView = upperView {
            PXLayout.put(view: view, onBottomOf: upperView, withMargin: PXLayout.L_MARGIN).isActive = true
        }
        return view
    }
}

class PXErrorView: PXBodyView {
    var titleLabel: UILabel?
    var descriptionLabel: UILabel?
    var actionButton: UIButton?
    var middleDivider: UIView?
    var secondaryTitleLabel: UILabel?
    var bottomDivider: UIView?
}
