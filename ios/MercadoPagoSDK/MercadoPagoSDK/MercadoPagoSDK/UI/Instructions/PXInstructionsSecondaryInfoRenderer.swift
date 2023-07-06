//
//  PXInstructionsSecondaryInfoRenderer.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 11/15/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

class PXInstructionsSecondaryInfoRenderer: NSObject {
    let CONTENT_WIDTH_PERCENT: CGFloat = 84.0
    let LABEL_FONT_SIZE: CGFloat = PXLayout.XXXS_FONT

    func render(instructionsSecondaryInfo: PXInstructionsSecondaryInfoComponent) -> PXInstructionsSecondaryInfoView {
        let instructionsSecondaryInfoView = PXInstructionsSecondaryInfoView()
        instructionsSecondaryInfoView.translatesAutoresizingMaskIntoConstraints = false
        instructionsSecondaryInfoView.backgroundColor = .white

        var lastLabel: UILabel?
        for string in instructionsSecondaryInfo.props.secondaryInfo {
            let attributes = [ NSAttributedString.Key.font: Utils.getFont(size: LABEL_FONT_SIZE) ]
            let attributedString = NSAttributedString(string: string, attributes: attributes)
            let secondaryInfoLabel = buildSecondaryInfoLabel(with: attributedString, in: instructionsSecondaryInfoView, onBottomOf: lastLabel)
            instructionsSecondaryInfoView.secondaryInfoLabels = Array.safeAppend(instructionsSecondaryInfoView.secondaryInfoLabels, secondaryInfoLabel)
            lastLabel = secondaryInfoLabel
        }

        instructionsSecondaryInfoView.pinLastSubviewToBottom(withMargin: PXLayout.S_MARGIN)?.isActive = true

        return instructionsSecondaryInfoView
    }

    func buildSecondaryInfoLabel(with text: NSAttributedString, in superView: UIView, onBottomOf upperView: UIView?) -> UILabel {
        let secondaryInfoLabel = UILabel()
        secondaryInfoLabel.translatesAutoresizingMaskIntoConstraints = false
        secondaryInfoLabel.textAlignment = .left
        secondaryInfoLabel.textColor = .pxBrownishGray
        secondaryInfoLabel.numberOfLines = 0
        secondaryInfoLabel.attributedText = text
        secondaryInfoLabel.lineBreakMode = .byWordWrapping
        superView.addSubview(secondaryInfoLabel)

        let screenWidth = PXLayout.getScreenWidth(applyingMarginFactor: CONTENT_WIDTH_PERCENT)

        let height = UILabel.requiredHeight(forAttributedText: text, withFont: Utils.getFont(size: LABEL_FONT_SIZE), inWidth: screenWidth)
        PXLayout.setHeight(owner: secondaryInfoLabel, height: height).isActive = true
        PXLayout.matchWidth(ofView: secondaryInfoLabel, withPercentage: CONTENT_WIDTH_PERCENT).isActive = true
        PXLayout.centerHorizontally(view: secondaryInfoLabel).isActive = true
        if let upperView = upperView {
            PXLayout.put(view: secondaryInfoLabel, onBottomOf: upperView, withMargin: PXLayout.S_MARGIN).isActive = true
        } else {
            PXLayout.pinTop(view: secondaryInfoLabel, withMargin: PXLayout.S_MARGIN).isActive = true
        }

        return secondaryInfoLabel
    }
}

class PXInstructionsSecondaryInfoView: PXComponentView {
    public var secondaryInfoLabels: [UILabel]?
}
