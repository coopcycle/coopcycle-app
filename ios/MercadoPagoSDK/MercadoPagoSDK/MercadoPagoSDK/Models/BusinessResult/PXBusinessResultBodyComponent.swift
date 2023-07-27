//
//  PXBusinessResultBodyComponent.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 17/09/2019.
//

import UIKit

class PXBusinessResultBodyComponent: PXComponentizable {
    var helpMessageComponent: PXComponentizable?

    init(helpMessageComponent: PXComponentizable?) {
        self.helpMessageComponent = helpMessageComponent
    }

    func render() -> UIView {
        let bodyView = UIView()
        bodyView.translatesAutoresizingMaskIntoConstraints = false
        if let helpMessage = self.helpMessageComponent {
            let helpView = helpMessage.render()
            bodyView.addSubview(helpView)
            PXLayout.pinLeft(view: helpView).isActive = true
            PXLayout.pinRight(view: helpView).isActive = true
        }

        PXLayout.pinFirstSubviewToTop(view: bodyView)?.isActive = true
        PXLayout.pinLastSubviewToBottom(view: bodyView)?.isActive = true
        return bodyView
    }
}
