//
//  PXInstructionsActionRenderer.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 11/16/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation
import MLUI

class PXInstructionsActionRenderer: NSObject {
    let CONTENT_WIDTH_PERCENT: CGFloat = 100.0
    let ACTION_LABEL_FONT_SIZE: CGFloat = PXLayout.XS_FONT
    let ACTION_LABEL_FONT_COLOR: UIColor = .px_blueMercadoPago()

    func render(_ instructionsAction: PXInstructionsActionComponent) -> PXInstructionsActionView {
        let instructionsActionView = PXInstructionsActionView()
        instructionsActionView.translatesAutoresizingMaskIntoConstraints = false
        instructionsActionView.backgroundColor = .clear

        guard let label = instructionsAction.props.instructionActionInfo?.label, instructionsAction.props.instructionActionInfo?.tag != nil else {
            return instructionsActionView
        }

        instructionsActionView.actionButton = buildActionButton(with: label, props: instructionsAction.props.instructionActionInfo, in: instructionsActionView)

        return instructionsActionView
    }

    func buildActionButton(with text: String, props: PXInstructionAction?, in superView: UIView) -> UIButton {
        let button = MPButton()
        button.translatesAutoresizingMaskIntoConstraints = false
        button.setTitle(text, for: .normal)
        button.titleLabel?.font = Utils.getFont(size: ACTION_LABEL_FONT_SIZE)
        button.setTitleColor(ACTION_LABEL_FONT_COLOR, for: .normal)

        if props?.tag == PXActionTag.LINK.rawValue, let url = props?.url {
            button.actionLink = url

            button.add(for: .touchUpInside) {
                if let URL = button.actionLink {
                    self.goToURL(URL)
                }
            }
        } else if props?.tag == PXActionTag.COPY.rawValue, let content = props?.content {
            button.add(for: .touchUpInside) {
                self.copyContent(content)
            }
        }

        superView.addSubview(button)

        let screenWidth = PXLayout.getScreenWidth(applyingMarginFactor: CONTENT_WIDTH_PERCENT)

        let height = UILabel.requiredHeight(forText: text, withFont: Utils.getFont(size: ACTION_LABEL_FONT_SIZE), inNumberOfLines: 0, inWidth: screenWidth)
        PXLayout.setHeight(owner: button, height: height).isActive = true
        PXLayout.matchWidth(ofView: button, withPercentage: CONTENT_WIDTH_PERCENT).isActive = true
        PXLayout.centerHorizontally(view: button).isActive = true
        PXLayout.pinTop(view: button).isActive = true
        PXLayout.pinBottom(view: button).isActive = true

        return button
    }

    func goToURL(_ url: String) {
        if let url = URL(string: url) {
            UIApplication.shared.open(url, options: [:], completionHandler: nil)
        }
    }

    func copyContent(_ content: String) {
        UIPasteboard.general.string = content
        MLSnackbar.show(withTitle: "payment_result_screen_congrats_copy_button".localized, type: MLSnackbarType.success(), duration: .short)
    }
}

class PXInstructionsActionView: PXComponentView {
    public var actionButton: UIButton?
}
