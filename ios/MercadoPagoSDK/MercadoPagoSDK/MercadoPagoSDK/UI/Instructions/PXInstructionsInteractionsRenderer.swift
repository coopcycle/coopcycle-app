//
//  PXInstructionsInteractionsRenderer.swift
//  MercadoPagoSDK
//
//  Created by Marcelo Oscar José on 24/10/2018.
//

import Foundation

class PXInstructionsInteractionsRenderer: NSObject {
    let CONTENT_WIDTH_PERCENT: CGFloat = 84.0
    let TITLE_LABEL_FONT_SIZE: CGFloat = PXLayout.M_FONT
    let TITLE_LABEL_FONT_COLOR: UIColor = .black

    func render(_ instructionsInteractions: PXInstructionsInteractionsComponent) -> PXInstructionsInteractionsView {
        let instructionsInteractionsView = PXInstructionsInteractionsView()
        instructionsInteractionsView.translatesAutoresizingMaskIntoConstraints = false
        instructionsInteractionsView.backgroundColor = .white
        var lastView: UIView?

        if let title = instructionsInteractions.props.title, !title.isEmpty {
            let attributes = [ NSAttributedString.Key.font: Utils.getFont(size: TITLE_LABEL_FONT_SIZE) ]
            let attributedString = NSAttributedString(string: title, attributes: attributes)
            instructionsInteractionsView.titleLabel = buildTitleLabel(with: attributedString, in: instructionsInteractionsView)
            lastView = instructionsInteractionsView.titleLabel
        }

        for interaction in instructionsInteractions.getInteractionComponents() {
            let isFirstView = String.isNullOrEmpty(instructionsInteractions.props.title) && instructionsInteractionsView.titleLabel == nil
            let interactionView = buildInteractionView(with: interaction, in: instructionsInteractionsView, onBottomOf: lastView, isFirstView: isFirstView)
            instructionsInteractionsView.interactionsComponents = Array.safeAppend(instructionsInteractionsView.interactionsComponents, interactionView)
            lastView = interactionView
        }

        instructionsInteractionsView.pinLastSubviewToBottom()?.isActive = true

        return instructionsInteractionsView
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

    func buildInteractionView(with reference: PXInstructionsInteractionComponent, in superView: UIView, onBottomOf upperView: UIView?, isFirstView: Bool = false) -> UIView {

        let interactionView = reference.render()
        superView.addSubview(interactionView)
        PXLayout.matchWidth(ofView: interactionView, withPercentage: CONTENT_WIDTH_PERCENT).isActive = true
        PXLayout.centerHorizontally(view: interactionView).isActive = true
        if let upperView = upperView {
            PXLayout.put(view: interactionView, onBottomOf: upperView, withMargin: PXLayout.L_MARGIN).isActive = true
        } else {
            PXLayout.pinTop(view: interactionView, withMargin: PXLayout.L_MARGIN).isActive = true
        }

        return interactionView
    }
}

class PXInstructionsInteractionsView: PXComponentView {
    public var titleLabel: UILabel?
    public var interactionsComponents: [UIView]?
}
