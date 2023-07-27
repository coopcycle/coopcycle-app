//
//  PXInstructionsTertiaryInfoRenderer.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 11/16/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

class PXInstructionsTertiaryInfoRenderer: NSObject {
    let CONTENT_WIDTH_PERCENT: CGFloat = 84.0
    let TITLE_LABEL_FONT_SIZE: CGFloat = PXLayout.M_FONT
    let TITLE_LABEL_FONT_COLOR: UIColor = .black
    let INFO_LABEL_FONT_SIZE: CGFloat = PXLayout.XXXS_FONT
    let INFO_LABEL_FONT_COLOR: UIColor = .pxBrownishGray

    func render(_ instructionsTertiaryInfo: PXInstructionsTertiaryInfoComponent) -> PXInstructionsTertiaryInfoView {
        let instructionsTertiaryInfoView = PXInstructionsTertiaryInfoView()
        instructionsTertiaryInfoView.translatesAutoresizingMaskIntoConstraints = false
        instructionsTertiaryInfoView.backgroundColor = .pxLightGray

        var lastLabel: UILabel?

        if let tertiaryInfoContent = instructionsTertiaryInfo.props.tertiaryInfo, !Array.isNullOrEmpty(instructionsTertiaryInfo.props.tertiaryInfo) {
            for text in tertiaryInfoContent {

                let attributes = [NSAttributedString.Key.font: Utils.getFont(size: INFO_LABEL_FONT_SIZE)]
                let attributedString = NSAttributedString(string: text, attributes: attributes)
                let infoContentLabel = buildInfoLabel(with: attributedString, in: instructionsTertiaryInfoView, onBottomOf: lastLabel)
                instructionsTertiaryInfoView.tertiaryInfoLabels = Array.safeAppend(instructionsTertiaryInfoView.tertiaryInfoLabels, infoContentLabel)
                lastLabel = infoContentLabel
            }
        }

        instructionsTertiaryInfoView.pinLastSubviewToBottom()?.isActive = true

        return instructionsTertiaryInfoView
    }

    func buildInfoLabel(with text: NSAttributedString, in superView: UIView, onBottomOf upperView: UIView?) -> UILabel {
        let infoLabel = UILabel()
        infoLabel.translatesAutoresizingMaskIntoConstraints = false
        infoLabel.textAlignment = .left 
        infoLabel.numberOfLines = 0
        infoLabel.attributedText = text
        infoLabel.lineBreakMode = .byWordWrapping
        superView.addSubview(infoLabel)
        let textSize: CGFloat = INFO_LABEL_FONT_SIZE
        infoLabel.textColor = INFO_LABEL_FONT_COLOR

        let screenWidth = PXLayout.getScreenWidth(applyingMarginFactor: CONTENT_WIDTH_PERCENT)

        let height = UILabel.requiredHeight(forAttributedText: text, withFont: Utils.getFont(size: textSize), inWidth: screenWidth)
        PXLayout.setHeight(owner: infoLabel, height: height).isActive = true
        PXLayout.matchWidth(ofView: infoLabel, withPercentage: CONTENT_WIDTH_PERCENT).isActive = true
        PXLayout.centerHorizontally(view: infoLabel).isActive = true
        if let upperView = upperView {
            PXLayout.put(view: infoLabel, onBottomOf: upperView, withMargin: PXLayout.XXS_MARGIN).isActive = true
        } else {
            PXLayout.pinTop(view: infoLabel, withMargin: PXLayout.L_MARGIN).isActive = true
        }

        return infoLabel
    }
}

class PXInstructionsTertiaryInfoView: PXComponentView {
    public var tertiaryInfoLabels: [UILabel]?
}
