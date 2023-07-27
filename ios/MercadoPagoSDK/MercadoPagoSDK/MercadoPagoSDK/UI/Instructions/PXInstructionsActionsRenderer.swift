//
//  PXInstructionsActionsRenderer.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 11/16/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

class PXInstructionsActionsRenderer: NSObject {
    let CONTENT_WIDTH_PERCENT: CGFloat = 84.0
    let ACCREDITATION_LABEL_FONT_SIZE: CGFloat = PXLayout.XXXS_FONT
    let ACCREDITATION_LABEL_FONT_COLOR: UIColor = .clear

    func render(_ instructionsActions: PXInstructionsActionsComponent) -> PXInstructionsActionsView {
        let instructionsActionsView = PXInstructionsActionsView()
        instructionsActionsView.translatesAutoresizingMaskIntoConstraints = false
        instructionsActionsView.backgroundColor = .pxLightGray
        var lastView: UIView?

        for action in instructionsActions.getActionComponents() {
            let actionView = buildActionView(with: action, in: instructionsActionsView, onBottomOf: lastView)
            instructionsActionsView.actionsViews = Array.safeAppend(instructionsActionsView.actionsViews, actionView)
            lastView = actionView
        }

        instructionsActionsView.pinLastSubviewToBottom()?.isActive = true

        return instructionsActionsView
    }

    func buildActionView(with action: PXInstructionsActionComponent, in superView: UIView, onBottomOf upperView: UIView?, isFirstView: Bool = false) -> UIView {
        let actionView = action.render()
        superView.addSubview(actionView)
        PXLayout.matchWidth(ofView: actionView, withPercentage: CONTENT_WIDTH_PERCENT).isActive = true
        PXLayout.centerHorizontally(view: actionView).isActive = true
        if let upperView = upperView {
            PXLayout.put(view: actionView, onBottomOf: upperView, withMargin: PXLayout.L_MARGIN).isActive = true
        } else {
            PXLayout.pinTop(view: actionView, withMargin: PXLayout.L_MARGIN).isActive = true
        }

        return actionView
    }
}

class PXInstructionsActionsView: PXComponentView {
    public var actionsViews: [UIView]?
}
