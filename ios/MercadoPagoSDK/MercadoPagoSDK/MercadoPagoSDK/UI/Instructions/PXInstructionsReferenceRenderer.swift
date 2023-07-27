//
//  PXInstructionsReferenceRenderer.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 11/16/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

class PXInstructionsReferenceRenderer: NSObject {
    let CONTENT_WIDTH_PERCENT: CGFloat = 100.0
    let TITLE_LABEL_FONT_SIZE: CGFloat = PXLayout.XXXS_FONT
    let TITLE_LABEL_FONT_COLOR: UIColor = .pxBrownishGray
    let REFERENCE_LABEL_FONT_SIZE: CGFloat = PXLayout.M_FONT
    let REFERENCE_LABEL_FONT_COLOR: UIColor = .black

    func render(_ instructionReference: PXInstructionsReferenceComponent) -> PXInstructionsReferenceView {
        let instructionReferenceView = PXInstructionsReferenceView()
        instructionReferenceView.translatesAutoresizingMaskIntoConstraints = false
        instructionReferenceView.backgroundColor = .pxLightGray
        var lastView: UIView?

        if let title = instructionReference.props.reference?.label {
            let attributes = [NSAttributedString.Key.font: Utils.getFont(size: TITLE_LABEL_FONT_SIZE)]
            let attributedString = NSAttributedString(string: title, attributes: attributes)
            instructionReferenceView.titleLabel = buildLabel(with: attributedString, in: instructionReferenceView, onBottomOf: nil, isTitle: true)
            lastView = instructionReferenceView.titleLabel
        }

        if let referenceText = instructionReference.props.reference?.getFullReferenceValue(), referenceText.isNotEmpty {
            let attributes = [NSAttributedString.Key.font: Utils.getFont(size: REFERENCE_LABEL_FONT_SIZE)]
            let attributedString = NSAttributedString(string: referenceText, attributes: attributes)
            instructionReferenceView.referenceLabel = buildLabel(with: attributedString, in: instructionReferenceView, onBottomOf: lastView)
            lastView = instructionReferenceView.referenceLabel
        }

        if lastView != nil {
            _ = instructionReferenceView.pinLastSubviewToBottom()
        }

        return instructionReferenceView
    }

    func buildLabel(with text: NSAttributedString, in superView: UIView, onBottomOf upperView: UIView?, isTitle: Bool = false) -> UILabel {
        let label = UILabel()
        label.translatesAutoresizingMaskIntoConstraints = false
        label.textAlignment = .left
        label.numberOfLines = 0
        label.attributedText = text
        label.lineBreakMode = .byWordWrapping
        superView.addSubview(label)
        var textColor: UIColor = REFERENCE_LABEL_FONT_COLOR
        var textSize: CGFloat = REFERENCE_LABEL_FONT_SIZE
        if isTitle {
            textColor = TITLE_LABEL_FONT_COLOR
            textSize = TITLE_LABEL_FONT_SIZE
        }
        label.textColor = textColor

        let screenWidth = PXLayout.getScreenWidth(applyingMarginFactor: CONTENT_WIDTH_PERCENT)

        let height = UILabel.requiredHeight(forAttributedText: text, withFont: Utils.getFont(size: textSize), inWidth: screenWidth)
        PXLayout.setHeight(owner: label, height: height).isActive = true
        PXLayout.matchWidth(ofView: label, withPercentage: CONTENT_WIDTH_PERCENT).isActive = true
        PXLayout.centerHorizontally(view: label).isActive = true

        if let upperView = upperView {
            PXLayout.put(view: label, onBottomOf: upperView, withMargin: PXLayout.XXXS_MARGIN).isActive = true
        } else {
            PXLayout.pinTop(view: label, withMargin: PXLayout.ZERO_MARGIN).isActive = true
        }

        return label
    }
}

class PXInstructionsReferenceView: PXComponentView {
    public var titleLabel: UILabel?
    public var referenceLabel: UILabel?
}
