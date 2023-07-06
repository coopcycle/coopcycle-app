//
//  PXInstructionsSubtitleRenderer.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 11/15/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

class PXInstructionsSubtitleRenderer: NSObject {
    let CONTENT_WIDTH_PERCENT: CGFloat = 84.0
    let LABEL_FONT_SIZE: CGFloat = PXLayout.L_FONT

    func render(_ instructionsSubtitle: PXInstructionsSubtitleComponent) -> PXInstructionsSubtitleView {
        let instructionsSubtitleView = PXInstructionsSubtitleView()
        instructionsSubtitleView.translatesAutoresizingMaskIntoConstraints = false
        instructionsSubtitleView.backgroundColor = .white
        let attributes = [NSAttributedString.Key.font: Utils.getFont(size: LABEL_FONT_SIZE)]
        let attributedString = NSAttributedString(string: instructionsSubtitle.props.subtitle, attributes: attributes)
        instructionsSubtitleView.subtitleLabel = buildSubtitleLabel(with: attributedString, in: instructionsSubtitleView)
        return instructionsSubtitleView
    }

    func buildSubtitleLabel(with text: NSAttributedString, in superView: UIView) -> UILabel {
        let subtitleLabel = UILabel()
        subtitleLabel.translatesAutoresizingMaskIntoConstraints = false
        subtitleLabel.textAlignment = .left
        subtitleLabel.textColor = .pxBrownishGray
        subtitleLabel.numberOfLines = 0
        subtitleLabel.attributedText = text
        subtitleLabel.lineBreakMode = .byWordWrapping
        superView.addSubview(subtitleLabel)

        let screenWidth = PXLayout.getScreenWidth(applyingMarginFactor: CONTENT_WIDTH_PERCENT)

        let height = UILabel.requiredHeight(forAttributedText: text, withFont: Utils.getFont(size: LABEL_FONT_SIZE), inWidth: screenWidth)
        PXLayout.setHeight(owner: subtitleLabel, height: height).isActive = true
        PXLayout.matchWidth(ofView: subtitleLabel, withPercentage: CONTENT_WIDTH_PERCENT).isActive = true
        PXLayout.centerHorizontally(view: subtitleLabel).isActive = true
        PXLayout.pinBottom(view: subtitleLabel, withMargin: PXLayout.L_MARGIN).isActive = true
        PXLayout.pinTop(view: subtitleLabel, withMargin: PXLayout.L_MARGIN).isActive = true
        return subtitleLabel
    }
}

class PXInstructionsSubtitleView: PXComponentView {
    public var subtitleLabel: UILabel?
}
