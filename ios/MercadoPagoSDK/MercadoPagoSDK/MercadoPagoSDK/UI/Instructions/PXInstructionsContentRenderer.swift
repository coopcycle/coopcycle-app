//
//  PXInstructionsContentRenderer.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 11/15/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

class PXInstructionsContentRenderer: NSObject {

    func render(_ instructionsContent: PXInstructionsContentComponent) -> PXInstructionsContentView {
        let instructionsContentView = PXInstructionsContentView()
        instructionsContentView.translatesAutoresizingMaskIntoConstraints = false
        instructionsContentView.backgroundColor = .pxLightGray
        var bottomView: UIView!

        if instructionsContent.hasInfo(), let infoComponent = instructionsContent.getInfoComponent() {
            instructionsContentView.infoView = infoComponent.render()
            if let infoView = instructionsContentView.infoView {
                instructionsContentView.addSubview(infoView)
                PXLayout.pinTop(view: infoView).isActive = true
                PXLayout.centerHorizontally(view: infoView).isActive = true
                PXLayout.matchWidth(ofView: infoView).isActive = true
                bottomView = instructionsContentView.infoView
            }
        }

        if instructionsContent.hasReferences(), let referencesComponent = instructionsContent.getReferencesComponent() {
            instructionsContentView.referencesView = referencesComponent.render()
            if let referencesView = instructionsContentView.referencesView {
                instructionsContentView.addSubview(referencesView)
                if let lastView = bottomView {
                    PXLayout.put(view: referencesView, onBottomOf: lastView).isActive = true
                } else {
                    PXLayout.pinTop(view: referencesView).isActive = true
                }
                PXLayout.centerHorizontally(view: referencesView).isActive = true
                PXLayout.matchWidth(ofView: referencesView).isActive = true
                bottomView = instructionsContentView.referencesView
            }
        }

        if instructionsContent.hasInteractions(), let interactionsComponent = instructionsContent.getInteractionsComponent() {
            instructionsContentView.interactionsView = interactionsComponent.render()
            if let interactionsView = instructionsContentView.interactionsView {
                instructionsContentView.addSubview(interactionsView)
                if let lastView = bottomView {
                    PXLayout.put(view: interactionsView, onBottomOf: lastView).isActive = true
                } else {
                    PXLayout.pinTop(view: interactionsView).isActive = true
                }
                PXLayout.centerHorizontally(view: interactionsView).isActive = true
                PXLayout.matchWidth(ofView: interactionsView).isActive = true
                bottomView = instructionsContentView.interactionsView
            }
        }

        if instructionsContent.hasTertiaryInfo(), let tertiaryInfoComponent = instructionsContent.getTertiaryInfoComponent() {
            instructionsContentView.tertiaryInfoView = tertiaryInfoComponent.render()
            if let tertiaryInfoView = instructionsContentView.tertiaryInfoView {
                instructionsContentView.addSubview(tertiaryInfoView)
                if let lastView = bottomView {
                    PXLayout.put(view: tertiaryInfoView, onBottomOf: lastView).isActive = true
                } else {
                    PXLayout.pinTop(view: tertiaryInfoView).isActive = true
                }
                PXLayout.centerHorizontally(view: tertiaryInfoView).isActive = true
                PXLayout.matchWidth(ofView: tertiaryInfoView).isActive = true
                bottomView = instructionsContentView.tertiaryInfoView

            }
        }

        if instructionsContent.hasAccreditationTime(), let accreditationTimeComponent = instructionsContent.getAccreditationTimeComponent() {
            instructionsContentView.accreditationTimeView = accreditationTimeComponent.render()
            if let accreditationTimeView = instructionsContentView.accreditationTimeView {
                instructionsContentView.addSubview(accreditationTimeView)
                if let lastView = bottomView {
                    PXLayout.put(view: accreditationTimeView, onBottomOf: lastView).isActive = true
                } else {
                    PXLayout.pinTop(view: accreditationTimeView).isActive = true
                }
                PXLayout.centerHorizontally(view: accreditationTimeView).isActive = true
                PXLayout.matchWidth(ofView: accreditationTimeView).isActive = true
                bottomView = instructionsContentView.accreditationTimeView
            }
        }
        if instructionsContent.hasActions(), let actionsComponent = instructionsContent.getActionsComponent() {
            instructionsContentView.actionsView = actionsComponent.render()
            if let actionsView = instructionsContentView.actionsView {
                instructionsContentView.addSubview(actionsView)
                if let lastView = bottomView {
                    PXLayout.put(view: actionsView, onBottomOf: lastView).isActive = true
                } else {
                    PXLayout.pinTop(view: actionsView).isActive = true
                }
                PXLayout.centerHorizontally(view: actionsView).isActive = true
                PXLayout.matchWidth(ofView: actionsView).isActive = true
                bottomView = instructionsContentView.actionsView
            }
        }

        PXLayout.pinBottom(view: bottomView, withMargin: PXLayout.L_MARGIN).isActive = true

        return instructionsContentView
    }
}

class PXInstructionsContentView: PXComponentView {
    public var infoView: UIView?
    public var referencesView: UIView?
    public var interactionsView: UIView?
    public var tertiaryInfoView: UIView?
    public var accreditationTimeView: UIView?
    public var actionsView: UIView?
}
