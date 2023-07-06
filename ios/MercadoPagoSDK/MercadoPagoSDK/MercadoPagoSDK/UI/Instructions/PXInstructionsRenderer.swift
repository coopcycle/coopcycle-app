//
//  PXInstructionsRenderer.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 11/15/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

class PXInstructionsRenderer: NSObject {

    func render(_ instructions: PXInstructionsComponent) -> PXInstructionsView {
        let instructionsView = PXInstructionsView()
        instructionsView.translatesAutoresizingMaskIntoConstraints = false
        var bottomView: UIView!

        //Subtitle Component
        if instructions.hasSubtitle(), let subtitleComponent = instructions.getSubtitleComponent() {
            instructionsView.subtitleView = subtitleComponent.render()
            instructionsView.addSubview(instructionsView.subtitleView!)
            PXLayout.pinTop(view: instructionsView.subtitleView!).isActive = true
            PXLayout.matchWidth(ofView: instructionsView.subtitleView!).isActive = true
            PXLayout.centerHorizontally(view: instructionsView.subtitleView!).isActive = true
        }

        //Content Component
        if let contentComponent = instructions.getContentComponent() {
            instructionsView.contentsView = contentComponent.render()
            instructionsView.addSubview(instructionsView.contentsView!)
            if let subtitleView = instructionsView.subtitleView {
                PXLayout.put(view: instructionsView.contentsView!, onBottomOf: subtitleView).isActive = true
            } else {
                PXLayout.pinTop(view: instructionsView.contentsView!).isActive = true
            }
            PXLayout.matchWidth(ofView: instructionsView.contentsView!).isActive = true
            PXLayout.centerHorizontally(view: instructionsView.contentsView!).isActive = true
            bottomView = instructionsView.contentsView!
        }

        //Secondary Info Component
        if instructions.hasSecondaryInfo(), instructions.shouldShowEmailInSecondaryInfo(), let secondaryInfoComponent = instructions.getSecondaryInfoComponent() {
            instructionsView.secondaryInfoView = secondaryInfoComponent.render()
            instructionsView.addSubview(instructionsView.secondaryInfoView!)
            PXLayout.put(view: instructionsView.secondaryInfoView!, onBottomOf: instructionsView.contentsView!).isActive = true
            PXLayout.matchWidth(ofView: instructionsView.secondaryInfoView!).isActive = true
            PXLayout.centerHorizontally(view: instructionsView.secondaryInfoView!).isActive = true
            bottomView = instructionsView.secondaryInfoView!
        }

        if let secondaryInfo = instructionsView.secondaryInfoView {
            PXLayout.put(view: instructionsView.contentsView!, aboveOf: secondaryInfo).isActive = true
            PXLayout.pinBottom(view: bottomView).isActive = true
        } else {
            PXLayout.pinBottom(view: instructionsView.contentsView!).isActive = true
        }

        return instructionsView
    }
}

class PXInstructionsView: PXBodyView {
    public var subtitleView: UIView?
    public var contentsView: UIView?
    public var secondaryInfoView: UIView?
}
