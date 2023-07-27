//
//  PXBodyRenderer.swift
//  TestAutolayout
//
//  Created by Demian Tejo on 10/19/17.
//  Copyright © 2017 Demian Tejo. All rights reserved.
//

import UIKit

class PXBodyRenderer: NSObject {

    func render(_ body: PXBodyComponent) -> UIView {
        if body.hasInstructions(), let instructionsComponent = body.getInstructionsComponent() {
            return instructionsComponent.render()
        } else if body.props.paymentResult.isApproved() {
            let bodyView = PXComponentView()
            bodyView.translatesAutoresizingMaskIntoConstraints = false
            let components = body.getPaymentMethodComponents()
            for paymentMethodComponent in components {
                let pmView = paymentMethodComponent.render()
                pmView.addSeparatorLineToTop(height: 1)
                bodyView.addSubviewToBottom(pmView)
                PXLayout.pinLeft(view: pmView).isActive = true
                PXLayout.pinRight(view: pmView).isActive = true
            }

            if let creditsView = body.getCreditsExpectationView() {
                bodyView.addSubviewToBottom(creditsView)
                PXLayout.pinLeft(view: creditsView).isActive = true
                PXLayout.pinRight(view: creditsView).isActive = true
            }

            bodyView.pinLastSubviewToBottom()?.isActive = true
            bodyView.layoutIfNeeded()
            return bodyView
        } else if body.hasBodyError() {
            return body.getBodyErrorComponent().render()
        }
        let bodyView = UIView()
        bodyView.translatesAutoresizingMaskIntoConstraints = false
        return bodyView
    }
}

class PXBodyView: PXComponentView {
}
