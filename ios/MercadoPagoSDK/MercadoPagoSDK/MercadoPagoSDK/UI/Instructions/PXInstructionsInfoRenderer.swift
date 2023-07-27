//
//  PXInstructionsInfoRenderer.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 11/16/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

class PXInstructionsInfoRenderer: NSObject {
    let CONTENT_WIDTH_PERCENT: CGFloat = 84.0
    let TITLE_LABEL_FONT_SIZE: CGFloat = PXLayout.M_FONT
    let TITLE_LABEL_FONT_COLOR: UIColor = .black
    let INFO_LABEL_FONT_SIZE: CGFloat = PXLayout.XS_FONT
    let INFO_LABEL_FONT_COLOR: UIColor = .pxBrownishGray

    func render(_ instructionsInfo: PXInstructionsInfoComponent) -> PXInstructionsInfoView {
        let instructionsInfoView = PXInstructionsInfoView()
        instructionsInfoView.translatesAutoresizingMaskIntoConstraints = false
        instructionsInfoView.backgroundColor = .pxLightGray

        var lastView: UIView?

        if let infoTitle = instructionsInfo.props.infoTitle, !infoTitle.isEmpty {
            let attributes = [NSAttributedString.Key.font: Utils.getFont(size: TITLE_LABEL_FONT_SIZE)]
            let attributedString = NSAttributedString(string: infoTitle, attributes: attributes)
            let isLastLabel = Array.isNullOrEmpty(instructionsInfo.props.infoContent)
            instructionsInfoView.titleLabel = buildInfoLabel(with: attributedString, in: instructionsInfoView, onBottomOf: lastView, isLastLabel: isLastLabel, isTitle: true)
            lastView = instructionsInfoView.titleLabel
        }

        if let infoContent = instructionsInfo.props.infoContent, !Array.isNullOrEmpty(instructionsInfo.props.infoContent) {
            var loopsDone = 0
            for text in infoContent {
                var isLast = false

                if loopsDone == infoContent.count - 1 {
                    isLast = true
                }

                let attributes = [NSAttributedString.Key.font: Utils.getFont(size: INFO_LABEL_FONT_SIZE)]
                let attributedString = NSAttributedString(string: text, attributes: attributes)
                let isFirstInfo = loopsDone == 0
                let infoContentLabel = buildInfoLabel(with: attributedString, in: instructionsInfoView, onBottomOf: lastView, isLastLabel: isLast, bottomDivider: instructionsInfo.props.bottomDivider, isFirstInfo: isFirstInfo)
                instructionsInfoView.contentLabels = Array.safeAppend(instructionsInfoView.contentLabels, infoContentLabel)
                lastView = infoContentLabel
                loopsDone += 1
            }
        }

        if instructionsInfo.props.bottomDivider != nil, instructionsInfo.props.bottomDivider == true {
            instructionsInfoView.bottomDivider = buildBottomDivider(in: instructionsInfoView, onBottomOf: lastView)
            lastView = instructionsInfoView.bottomDivider
        }

        instructionsInfoView.pinLastSubviewToBottom()?.isActive = true

        return instructionsInfoView
    }

    func buildInfoLabel(with text: NSAttributedString, in superView: UIView, onBottomOf upperView: UIView?, isLastLabel: Bool = false, isTitle: Bool = false, bottomDivider: Bool? = false, isFirstInfo: Bool = false) -> UILabel {
        let infoLabel = UILabel()
        infoLabel.translatesAutoresizingMaskIntoConstraints = false
        infoLabel.textAlignment = .left
        infoLabel.numberOfLines = 0
        infoLabel.attributedText = text
        infoLabel.lineBreakMode = .byWordWrapping
        superView.addSubview(infoLabel)
        var textColor: UIColor = INFO_LABEL_FONT_COLOR
        var textSize: CGFloat = INFO_LABEL_FONT_SIZE
        if isTitle {
            textColor = TITLE_LABEL_FONT_COLOR
            textSize = TITLE_LABEL_FONT_SIZE
        }
        infoLabel.textColor = textColor

        let screenWidth = PXLayout.getScreenWidth(applyingMarginFactor: CONTENT_WIDTH_PERCENT)

        let height = UILabel.requiredHeight(forAttributedText: text, withFont: Utils.getFont(size: textSize), inWidth: screenWidth)
        PXLayout.setHeight(owner: infoLabel, height: height).isActive = true
        PXLayout.matchWidth(ofView: infoLabel, withPercentage: CONTENT_WIDTH_PERCENT).isActive = true
        PXLayout.centerHorizontally(view: infoLabel).isActive = true
        if let upperView = upperView {
            if isFirstInfo {
                PXLayout.put(view: infoLabel, onBottomOf: upperView, withMargin: PXLayout.L_MARGIN).isActive = true
            } else {
                PXLayout.put(view: infoLabel, onBottomOf: upperView, withMargin: PXLayout.ZERO_MARGIN).isActive = true
            }
        } else {
            PXLayout.pinTop(view: infoLabel, withMargin: PXLayout.L_MARGIN).isActive = true
        }

        return infoLabel
    }

    func buildBottomDivider(in superView: UIView, onBottomOf upperView: UIView?) -> UIView {
        let frame = CGRect(x: 0, y: 0, width: 0, height: 0)
        let view = UIView(frame: frame)
        view.translatesAutoresizingMaskIntoConstraints = false
        view.backgroundColor = .pxMediumLightGray
        superView.addSubview(view)
        PXLayout.setHeight(owner: view, height: 1).isActive = true
        PXLayout.matchWidth(ofView: view).isActive = true
        PXLayout.centerHorizontally(view: view).isActive = true

        if let upperView = upperView {
            PXLayout.put(view: view, onBottomOf: upperView, withMargin: PXLayout.L_MARGIN).isActive = true
        }

        return view
    }
}

class PXInstructionsInfoView: PXComponentView {
    public var titleLabel: UILabel?
    public var contentLabels: [UILabel]?
    public var bottomDivider: UIView?
}
