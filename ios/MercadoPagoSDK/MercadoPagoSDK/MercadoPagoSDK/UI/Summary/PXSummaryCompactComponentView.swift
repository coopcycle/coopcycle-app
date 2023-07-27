//
//  PXSummaryCompactComponentView.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 2/3/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

final class PXSummaryCompactComponentView: PXComponentView {
    static let TITLE_FONT_SIZE: CGFloat = PXLayout.XXXL_FONT
    static let CUSTOM_TITLE_FONT_SIZE: CGFloat = PXLayout.XS_FONT

    fileprivate let PERCENT_SCREEN_WIDTH: CGFloat = 86
    fileprivate let TOP_BOTTOM_MARGIN: CGFloat = PXLayout.L_MARGIN
    fileprivate let INTER_MARGIN: CGFloat = PXLayout.XXS_MARGIN

    fileprivate var totalLabel: UILabel?
    fileprivate var customTextLabel: UILabel?
}

extension PXSummaryCompactComponentView {

    func buildView(amountAttributeText: NSAttributedString, bottomCustomTitle: NSAttributedString, textColor: UIColor, backgroundColor: UIColor) -> CGFloat {

        self.backgroundColor = backgroundColor

        let screenWidth = PXLayout.getScreenWidth(applyingMarginFactor: PERCENT_SCREEN_WIDTH)

        let (tLabel, cLabel) = buildLabels(amountText: amountAttributeText, customText: bottomCustomTitle, in: self, textColor: textColor)

        let titleHeight = UILabel.requiredHeight(forAttributedText: amountAttributeText, withFont: Utils.getFont(size: PXSummaryCompactComponentView.TITLE_FONT_SIZE), inNumberOfLines: tLabel.numberOfLines, inWidth: screenWidth)
        PXLayout.setHeight(owner: tLabel, height: titleHeight).isActive = true

        let customTitleHeight = UILabel.requiredHeight(forAttributedText: bottomCustomTitle, withFont: Utils.getFont(size: PXSummaryCompactComponentView.CUSTOM_TITLE_FONT_SIZE), inNumberOfLines: cLabel.numberOfLines, inWidth: screenWidth)
        PXLayout.setHeight(owner: cLabel, height: customTitleHeight).isActive = true

        totalLabel = tLabel
        customTextLabel = cLabel

        return titleHeight + customTitleHeight + INTER_MARGIN + TOP_BOTTOM_MARGIN * 2
    }

    fileprivate func buildLabels(amountText: NSAttributedString?, customText: NSAttributedString?, in superView: UIView, textColor: UIColor) -> (UILabel, UILabel) {

        let amountLabel = UILabel()
        amountLabel.translatesAutoresizingMaskIntoConstraints = false
        amountLabel.textAlignment = .center
        amountLabel.numberOfLines = 1
        amountLabel.attributedText = amountText
        amountLabel.textColor = textColor
        superView.addSubview(amountLabel)

        PXLayout.pinTop(view: amountLabel, to: superView, withMargin: PXLayout.L_MARGIN).isActive = true
        PXLayout.centerHorizontally(view: amountLabel).isActive = true
        PXLayout.matchWidth(ofView: amountLabel, withPercentage: PERCENT_SCREEN_WIDTH).isActive = true

        let customTitleLabel = UILabel()
        customTitleLabel.translatesAutoresizingMaskIntoConstraints = false
        customTitleLabel.textAlignment = .center
        customTitleLabel.numberOfLines = 2
        customTitleLabel.lineBreakMode = .byTruncatingTail
        customTitleLabel.attributedText = customText
        customTitleLabel.textColor = textColor
        superView.addSubview(customTitleLabel)

        PXLayout.centerHorizontally(view: customTitleLabel).isActive = true
        PXLayout.matchWidth(ofView: customTitleLabel, toView: superView, withPercentage: PERCENT_SCREEN_WIDTH).isActive = true
        PXLayout.put(view: customTitleLabel, onBottomOf: amountLabel, withMargin: PXLayout.XXS_MARGIN).isActive = true

        return (amountLabel, customTitleLabel)
    }
}
