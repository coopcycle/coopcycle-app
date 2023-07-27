//
//  PXLoadingComponent.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 5/5/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import UIKit

final class PXLoadingComponent {

    static let shared = PXLoadingComponent()

    private lazy var loadingContainer = UIView()
    private lazy var backgroundColor = ThemeManager.shared.loadingComponent().backgroundColor
    private lazy var tintColor = ThemeManager.shared.loadingComponent().tintColor

    func showInView(_ view: UIView) -> UIView {

        let spinner = PXComponentFactory.Spinner.new(color1: tintColor, color2: tintColor)

        loadingContainer = UIView()
        loadingContainer.frame = view.frame
        loadingContainer.addSubview(spinner)

        PXLayout.centerHorizontally(view: spinner).isActive = true
        PXLayout.centerVertically(view: spinner).isActive = true

        spinner.show()

        view.backgroundColor = backgroundColor
        loadingContainer.backgroundColor = backgroundColor

        view.addSubview(loadingContainer)
        view.bringSubviewToFront(loadingContainer)

        return loadingContainer
    }

    func hide() {
        loadingContainer.removeFromSuperview()
    }
}
