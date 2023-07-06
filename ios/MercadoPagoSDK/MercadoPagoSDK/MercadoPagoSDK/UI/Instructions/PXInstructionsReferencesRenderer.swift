//
//  PXInstructionsReferencesRenderer.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 11/16/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

class PXInstructionsReferencesRenderer: NSObject {
    let CONTENT_WIDTH_PERCENT: CGFloat = 84.0
    let TITLE_LABEL_FONT_SIZE: CGFloat = PXLayout.M_FONT
    let TITLE_LABEL_FONT_COLOR: UIColor = .black

    func render(_ instructionsReferences: PXInstructionsReferencesComponent) -> PXInstructionsReferencesView {
        let instructionsReferencesView = PXInstructionsReferencesView()
        instructionsReferencesView.translatesAutoresizingMaskIntoConstraints = false
        instructionsReferencesView.backgroundColor = .pxLightGray
        var lastView: UIView?

        if let title = instructionsReferences.props.title, !title.isEmpty {
            let attributes = [ NSAttributedString.Key.font: Utils.getFont(size: TITLE_LABEL_FONT_SIZE) ]
            let attributedString = NSAttributedString(string: title, attributes: attributes)
            instructionsReferencesView.titleLabel = buildTitleLabel(with: attributedString, in: instructionsReferencesView)
            lastView = instructionsReferencesView.titleLabel
        }

        for reference in instructionsReferences.getReferenceComponents() {
            let isFirstView = String.isNullOrEmpty(instructionsReferences.props.title) && instructionsReferencesView.titleLabel == nil
            let referenceView = buildReferenceView(with: reference, in: instructionsReferencesView, onBottomOf: lastView, isFirstView: isFirstView)
            instructionsReferencesView.referencesComponents = Array.safeAppend(instructionsReferencesView.referencesComponents, referenceView)
            lastView = referenceView
        }

        instructionsReferencesView.pinLastSubviewToBottom()?.isActive = true

        return instructionsReferencesView
    }

    func buildTitleLabel(with text: NSAttributedString, in superView: UIView) -> UILabel {
        let titleLabel = UILabel()
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        titleLabel.textAlignment = .left
        titleLabel.numberOfLines = 0
        titleLabel.attributedText = text
        titleLabel.lineBreakMode = .byWordWrapping
        superView.addSubview(titleLabel)
        let textSize: CGFloat = TITLE_LABEL_FONT_SIZE
        titleLabel.textColor = TITLE_LABEL_FONT_COLOR

        let screenWidth = PXLayout.getScreenWidth(applyingMarginFactor: CONTENT_WIDTH_PERCENT)

        let height = UILabel.requiredHeight(forAttributedText: text, withFont: Utils.getFont(size: textSize), inWidth: screenWidth)
        PXLayout.setHeight(owner: titleLabel, height: height).isActive = true
        PXLayout.matchWidth(ofView: titleLabel, withPercentage: CONTENT_WIDTH_PERCENT).isActive = true
        PXLayout.centerHorizontally(view: titleLabel).isActive = true
        PXLayout.pinTop(view: titleLabel, withMargin: PXLayout.L_MARGIN).isActive = true

        return titleLabel
    }

    func buildReferenceView(with reference: PXInstructionsReferenceComponent, in superView: UIView, onBottomOf upperView: UIView?, isFirstView: Bool = false) -> UIView {

        let referenceView = reference.render()
        superView.addSubview(referenceView)
        PXLayout.matchWidth(ofView: referenceView, withPercentage: CONTENT_WIDTH_PERCENT).isActive = true
        PXLayout.centerHorizontally(view: referenceView).isActive = true
        if let upperView = upperView {
            PXLayout.put(view: referenceView, onBottomOf: upperView, withMargin: PXLayout.L_MARGIN).isActive = true
        } else {
            PXLayout.pinTop(view: referenceView, withMargin: PXLayout.L_MARGIN).isActive = true
        }

        return referenceView
    }
}

class PXInstructionsReferencesView: PXComponentView {
    public var titleLabel: UILabel?
    public var referencesComponents: [UIView]?
}
