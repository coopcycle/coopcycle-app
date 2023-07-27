//
//  FooterRenderer.swift
//  TestAutolayout
//
//  Created by Demian Tejo on 10/19/17.
//  Copyright © 2017 Demian Tejo. All rights reserved.
//

import UIKit

final class PXFooterRenderer: NSObject {

    let BUTTON_HEIGHT: CGFloat = 50.0
    weak var termsDelegate: PXTermsAndConditionViewDelegate?

    init(termsDelegate: PXTermsAndConditionViewDelegate? = nil) {
        self.termsDelegate = termsDelegate
    }

    func render(_ footer: PXFooterComponent) -> PXFooterView {
        let fooView = PXFooterView()
        var topView: UIView = fooView
        var termsView: PXTermsAndConditionView?
        fooView.translatesAutoresizingMaskIntoConstraints = false
        fooView.backgroundColor = .white

        if footer.props.termsInfo != nil {
            termsView = PXTermsAndConditionView(termsDto: footer.props.termsInfo, delegate: termsDelegate)
        }

        if let principalAction = footer.props.buttonAction {
            let principalButton = self.buildAnimatedButton(with: principalAction, color: footer.props.primaryColor)
            principalButton.add(for: .touchUpInside) {
                fooView.delegate?.didTapPrimaryAction()
            }

            principalButton.layer.shadowRadius = 4
            fooView.principalButton = principalButton
            fooView.principalButton?.animationDelegate = footer.props.animationDelegate
            fooView.addSubview(principalButton)

            if let termsView = termsView {
                fooView.insertSubview(termsView, belowSubview: principalButton)
                PXLayout.pinTop(view: termsView, to: fooView, withMargin: 0).isActive = true
                PXLayout.pinLeft(view: termsView, to: fooView, withMargin: PXLayout.ZERO_MARGIN).isActive = true
                PXLayout.pinRight(view: termsView, to: fooView, withMargin: PXLayout.ZERO_MARGIN).isActive = true
                PXLayout.setHeight(owner: termsView, height: termsView.DEFAULT_CREDITS_HEIGHT).isActive = true
                PXLayout.put(view: principalButton, onBottomOf: termsView, withMargin: PXLayout.S_MARGIN, relation: .equal).isActive = true
            } else {
                PXLayout.pinTop(view: principalButton, to: fooView, withMargin: PXLayout.S_MARGIN).isActive = true
            }

            PXLayout.pinLeft(view: principalButton, to: fooView, withMargin: PXLayout.S_MARGIN).isActive = true
            PXLayout.pinRight(view: principalButton, to: fooView, withMargin: PXLayout.S_MARGIN).isActive = true
            PXLayout.setHeight(owner: principalButton, height: BUTTON_HEIGHT).isActive = true
            topView = principalButton
        }
        if let linkAction = footer.props.linkAction {
            let linkButton = self.buildLinkButton(with: linkAction, color: footer.props.primaryColor)
            linkButton.add(for: .touchUpInside) {
                fooView.delegate?.didTapSecondaryAction()
            }

            fooView.linkButton = linkButton
            fooView.addSubview(linkButton)
            if topView != fooView {
               PXLayout.put(view: linkButton, onBottomOf: topView, withMargin: PXLayout.XXS_MARGIN).isActive = true
            } else {
                PXLayout.pinTop(view: linkButton, to: fooView, withMargin: PXLayout.S_MARGIN).isActive = true
            }

            PXLayout.pinLeft(view: linkButton, to: fooView, withMargin: PXLayout.S_MARGIN).isActive = true
            PXLayout.pinRight(view: linkButton, to: fooView, withMargin: PXLayout.S_MARGIN).isActive = true
            PXLayout.setHeight(owner: linkButton, height: BUTTON_HEIGHT).isActive = true
            topView = linkButton
        }
        if topView != fooView, footer.props.pinLastSubviewToBottom { // Si hay al menos alguna vista dentro del footer, agrego un margen
            PXLayout.pinBottom(view: topView, to: fooView, withMargin: PXLayout.S_MARGIN).isActive = true
        }
        return fooView
    }

    func buildPrincipalButton(with footerAction: PXAction, color: UIColor? = .pxBlueMp) -> PXPrimaryButton {
        let button = PXPrimaryButton()
        button.translatesAutoresizingMaskIntoConstraints = false
        button.buttonTitle = footerAction.label
        button.add(for: .touchUpInside, footerAction.action)
        return button
    }

    func buildAnimatedButton(with footerAction: PXAction, color: UIColor? = .pxBlueMp) -> PXAnimatedButton {
        let button = PXAnimatedButton(normalText: "Pagar".localized, loadingText: "Procesando tu pago".localized, retryText: "Reintentar".localized)
        button.backgroundColor = color
        button.translatesAutoresizingMaskIntoConstraints = false
        button.setTitle(footerAction.label, for: .normal)
        button.layer.cornerRadius = 4
        button.add(for: .touchUpInside, footerAction.action)
        return button
    }

    func buildLinkButton(with footerAction: PXAction, color: UIColor? = .pxBlueMp) -> PXSecondaryButton {
        let linkButton = PXSecondaryButton()
        linkButton.translatesAutoresizingMaskIntoConstraints = false
        linkButton.buttonTitle = footerAction.label
        linkButton.add(for: .touchUpInside, footerAction.action)
        return linkButton
    }
}
